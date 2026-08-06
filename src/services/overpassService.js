import axios from "axios";
import { mapBusiness } from "../utils/businessCategoryMapper.js";
import { reverseGeocode } from "./geocodingService.js";

const OVERPASS_URL = process.env.OVERPASS_API_URL;
const DEFAULT_RADIUS_METERS = Number(process.env.OVERPASS_DEFAULT_RADIUS);

export const fetchNearbyBusinesses = async (
    latitude,
    longitude,
    radius = DEFAULT_RADIUS_METERS
) => {
    try {
        if (
            latitude === undefined ||
            longitude === undefined ||
            latitude === null ||
            longitude === null ||
            isNaN(Number(latitude)) ||
            isNaN(Number(longitude))
        ) {
            throw new Error("Invalid latitude or longitude");
        }

        // Convert meters to kilometers
        const radiusKm = radius / 1000;

        // Dynamic timeout
        let overpassTimeout = 15;

        if (radiusKm > 3) {
            overpassTimeout = 25;
        }

        if (radiusKm > 5) {
            overpassTimeout = 40;
        }

        if (radiusKm > 10) {
            overpassTimeout = 60;
        }

        const overpassQuery = `
        [out:json][timeout:${overpassTimeout}];

        (
            node["name"](around:${radius},${latitude},${longitude});
            way["name"](around:${radius},${latitude},${longitude});
        );

        out center tags 100;
        `;

        const response = await axios.post(
            OVERPASS_URL,
            new URLSearchParams({
                data: overpassQuery.trim(),
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Accept: "application/json",
                    "User-Agent": "NYSC-Connect-App/1.0",
                },
                timeout: overpassTimeout * 1000,
            }
        );

        const businesses =
            response.data?.elements
                ?.map(mapBusiness)
                .filter((business) => {

                    if (!business) {
                        return false;
                    }

                    if (business.name === "Unnamed Business") {
                        return false;
                    }

                    if (
                        business.latitude === null ||
                        business.longitude === null ||
                        business.latitude === undefined ||
                        business.longitude === undefined ||
                        isNaN(Number(business.latitude)) ||
                        isNaN(Number(business.longitude))
                    ) {
                        return false;
                    }

                    return true;
                }) || [];

        // Remove duplicate businesses
        const uniqueBusinesses = Array.from(
            new Map(
                businesses.map((item) => [
                    `${item.name}-${item.latitude}-${item.longitude}`,
                    item,
                ])
            ).values()
        );

        // Enrich missing address information
        const enrichedBusinesses = await Promise.all(
            uniqueBusinesses.map(async (business, index) => {

                // Prevent hundreds of reverse-geocoding requests
                if (index >= 20) {
                    return business;
                }

                if (
                    business.address === "Unknown" ||
                    !business.city ||
                    !business.state
                ) {

                    const location = await reverseGeocode(
                        business.latitude,
                        business.longitude
                    );

                    if (business.address === "Unknown") {
                        business.address =
                            location.street || "Unknown";
                    }

                    business.city =
                        business.city || location.city;

                    business.state =
                        business.state || location.state;

                    business.countryCode =
                        location.country?.toUpperCase() ||
                        business.countryCode;
                }

                return business;
            })
        );

        return enrichedBusinesses;

    } catch (error) {

        console.error(
            "Overpass API Error:",
            error.response?.data || error.message
        );

        throw new Error(
            "Unable to fetch nearby places from OpenStreetMap"
        );
    }
};