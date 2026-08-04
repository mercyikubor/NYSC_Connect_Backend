import axios from "axios";
import { mapBusiness } from "../utils/businessCategoryMapper.js";


const OVERPASS_URL = process.env.OVERPASS_API_URL;
const DEFAULT_RADIUS_METERS = Number(process.env.OVERPASS_DEFAULT_RADIUS);
const REQUEST_TIMEOUT = Number(process.env.OVERPASS_TIMEOUT);

console.log("OVERPASS_URL =", OVERPASS_URL);
console.log("REQUEST_TIMEOUT =", REQUEST_TIMEOUT);

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
        
        const overpassQuery = `
        [out:json][timeout:30];

        (
        node["name"]["shop"](around:${radius},${latitude},${longitude});
        node["name"]["amenity"](around:${radius},${latitude},${longitude});
        node["name"]["tourism"](around:${radius},${latitude},${longitude});
        node["name"]["leisure"](around:${radius},${latitude},${longitude});
        node["name"]["craft"](around:${radius},${latitude},${longitude});

        way["name"]["shop"](around:${radius},${latitude},${longitude});
        way["name"]["amenity"](around:${radius},${latitude},${longitude});
        way["name"]["tourism"](around:${radius},${latitude},${longitude});
        way["name"]["leisure"](around:${radius},${latitude},${longitude});
        way["name"]["craft"](around:${radius},${latitude},${longitude});
        );

        out center tags 100;
        `;
        
        const response = await axios.post(
            OVERPASS_URL,
            new URLSearchParams({
                data: overpassQuery.trim()
            }),
            {
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded",
                    "Accept": "application/json",
                    "User-Agent": "NYSC-Connect-App/1.0"
                },
                timeout:REQUEST_TIMEOUT
            }
        );
        const businesses = response.data?.elements
        ?.map(mapBusiness)
        .filter(business => {
            if(!business){ return false;}
            if(business.name === "Unnamed Business"){return false;}
            if(
                business.latitude === null || 
                business.longitude === null ||
                business.latitude === undefined ||
                business.longitude === undefined ||
                isNaN(Number(business.latitude)) ||
                isNaN(Number(business.longitude))
            ){return false;}
            
            return true;
        }) || [];
        
        const uniqueBusinesses = Array.from(
            new Map(
                businesses.map(item => [
                    `${item.name}-${item.latitude}-${item.longitude}`,
                    item
                ])
            ).values()
        );
        return uniqueBusinesses;
    }catch(error){
        // console.error(
        //     "Overpass API Error:", 
        //     error.response?.data || error.message
        // );
         console.error("========== OVERPASS ERROR ==========");
         console.error("Message:", error.message);
         console.error("Code:", error.code);

          if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
    }

    console.error(error);

        throw new Error("Unable to fetch nearby businesses from OpenStreetMap");
    }
};