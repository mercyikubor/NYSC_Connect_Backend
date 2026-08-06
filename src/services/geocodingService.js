import axios from "axios";

export const reverseGeocode = async (latitude, longitude) => {

    try {

        const response = await axios.get(
            "https://nominatim.openstreetmap.org/reverse",
            {
                params:{
                    lat: latitude,
                    lon: longitude,
                    format:"json",
                },

                headers:{
                    "User-Agent":"NYSC-Connect-App/1.0"
                },

                timeout:10000
            }
        );

        const address = response.data?.address || {};

        return {
            street:
                address.road ||
                address.street ||
                null,

            city:
                address.city ||
                address.town ||
                address.village ||
                address.county ||
                null,

            state:
                address.state ||
                null,

            country:
                address.country_code ||
                null
        };

    } catch(error){

        return {
            street:null,
            city:null,
            state:null,
            country:null
        };

    }
};