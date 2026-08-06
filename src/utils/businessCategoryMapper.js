import { mapNigeriaState } from "./nigeriaStateMapper.js";

const CATEGORY_MAP = {
    restaurant: "Restaurant",
    fast_food: "Restaurant",
    cafe: "Restaurant",
    food_court: "Restaurant",

    bar: "Bar",
    pub: "Pub",

    bakery: "Bakery",

    supermarket: "Supermarket",
    convenience: "Supermarket",
    grocery: "Supermarket",
    greengrocer: "Supermarket",

    pharmacy: "Pharmacy",
    hospital: "Hospital",
    clinic: "Hospital",
    doctors: "Hospital",
    dentist: "Hospital",

    mall: "Shopping Mall",
    clothes: "Fashion",
    shoes: "Fashion",
    boutique: "Fashion",
    cosmetics: "Beauty",
    hairdresser: "Beauty",

    electronics: "Electronics",
    mobile_phone: "Electronics",
    computer: "Electronics",

    hotel: "Hotel",
    motel: "Hotel",
    guest_house: "Hotel",
    hostel: "Hotel",

    bank: "Bank",
    atm: "ATM",

    fuel: "Fuel Station",

    car_repair: "Mechanic",
    car_wash: "Car Wash",
    parking: "Parking",

    school: "School",
    university: "University",

    church: "Church",
    mosque: "Mosque",

    cinema: "Cinema",
    gym: "Gym",
    stadium: "Stadium",
    park: "Park",
};


export function mapCategory(tags = {}) {

    const value =
        tags.shop ||
        tags.amenity ||
        tags.tourism ||
        tags.leisure ||
        tags.office ||
        tags.craft;


    if (!value) {
        return {
            category: "Others",
            osmCategory: null,
        };
    }


    const normalizedValue = value.toLowerCase().trim();


    return {
        category: CATEGORY_MAP[normalizedValue] || "Others",
        osmCategory: normalizedValue,
    };
}

function normalizeWebsite(url){
    if(!url){
        return null;
    }

    url = url.trim();

    if(!url){
        return null;
    }

    try{
        if(
            !url.startsWith("http://") &&
            !url.startsWith("https://")
        ){
            url = `https://${url}`;
        }

        new URL(url);

        return url;
    } catch(error){
        return null;
    }
}

function normalizeUrl(url){
    if(!url){
        return null;
    }

    url = url.trim();

    if(!url){
        return null;
    }

    try{
        if(
            !url.startsWith("http://") &&
            !url.startsWith("https://")
        ){
            url = `https://${url}`;
        }

        new URL(url);

        return url;
    }catch(error){
        return null;
    }
}

function normalizeEmail(email){
    if(!email){
        return null;
    }

    email = email.trim();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email)
    ? email
    : null;
}

function createSlug(value){
    if(!value){
        return null;
    }

    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}



export function mapBusiness(element) {

    const tags = element.tags || {};

    const categoryData = mapCategory(tags);

    const address = [
            tags["addr:housenumber"],
            tags["addr:street"],
            tags["addr:suburb"],
            tags["addr:city"],
        ].filter(Boolean).join(", ");

    return {

        osmId: String(element.id),

        osmType: element.type,

        source: "osm",

        name: tags.name || "Unnamed Business",

        category: categoryData.category,

        osmCategory: categoryData.osmCategory,


        description:
            tags.description || 
            tags.note || 
            tags.brand || 
            null,


        phoneNumber:
            tags.phone ||
            tags["contact:phone"] ||
            tags["contact:mobile"] ||
            null,

        slug: createSlug(
            tags.name || "Unnamed Business"
        ),

        searchName:
        (tags.name || "Unnamed Business")
            .toLowerCase()
            .trim(),

        email: normalizeEmail(
            tags.email ||
            tags["contact:email"] ||
            null,
        ),

        website: normalizeWebsite(
            tags.website ||
            tags["contact:website"] ||
            null,
        ),

        address: 
            address ||
            tags.address ||
            "Unknown",


        city:
            tags["addr:city"] ||
            null,


        state:
            mapNigeriaState(
                tags["addr:state"]
            ),


        countryCode: "NG",


        latitude:
            Number(element.lat ||
            element.center?.lat) ||
            null,


        longitude:
            Number(element.lon ||
            element.center?.lon) || 
            null,


        openingHours:
            tags.opening_hours ||
            null,


        imageUrl: normalizeUrl(
            tags.image ||
            tags.wikimedia ||
            null,
        ),


        logoUrl: null,


        featured: false,

        verified: false,

        isOperational: true,

        syncStatus: "active",

        lastSynced:new Date(),
    };
}