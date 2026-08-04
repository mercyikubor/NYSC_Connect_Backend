const NIGERIA_STATE_MAP = {

    "lagos state": "Lagos",
    "lagos": "Lagos",

    "fct": "FCT",
    "federal capital territory": "FCT",
    "abuja": "FCT",
    "abuja municipal": "FCT",


    "rivers state": "Rivers",
    "rivers": "Rivers",

    "oyo state": "Oyo",
    "oyo": "Oyo",

    "ogun state": "Ogun",
    "ogun": "Ogun",

    "kaduna state": "Kaduna",
    "kaduna": "Kaduna",

    "kano state": "Kano",
    "kano": "Kano",

    "enugu state": "Enugu",
    "enugu": "Enugu",

    "anambra state": "Anambra",
    "anambra": "Anambra",

    "delta state": "Delta",
    "delta": "Delta",

    "edo state": "Edo",
    "edo": "Edo",

    "akwa ibom state": "Akwa Ibom",
    "akwa ibom": "Akwa Ibom",

    "cross river state": "Cross River",
    "cross river": "Cross River",

    "imo state": "Imo",
    "imo": "Imo",

    "abia state": "Abia",
    "abia": "Abia",


    "plateau state": "Plateau",
    "plateau": "Plateau",

    "nasarawa state": "Nasarawa",
    "nasarawa": "Nasarawa",

    "kwara state": "Kwara",
    "kwara": "Kwara",

    "osun state": "Osun",
    "osun": "Osun",

    "ondo state": "Ondo",
    "ondo": "Ondo",

    "ekiti state": "Ekiti",
    "ekiti": "Ekiti",

    "benue state": "Benue",
    "benue": "Benue",

    "borno state": "Borno",
    "borno": "Borno",

    "bayelsa state": "Bayelsa",
    "bayelsa": "Bayelsa",

    "bauchi state": "Bauchi",
    "bauchi": "Bauchi",

    "adamawa state": "Adamawa",
    "adamawa": "Adamawa",

    "katsina state": "Katsina",
    "katsina": "Katsina",

    "jigawa state": "Jigawa",
    "jigawa": "Jigawa",

    "kebbi state": "Kebbi",
    "kebbi": "Kebbi",

    "kogi state": "Kogi",
    "kogi": "Kogi",

    "niger state": "Niger",
    "niger": "Niger",


    "sokoto state": "Sokoto",
    "sokoto": "Sokoto",

    "taraba state": "Taraba",
    "taraba": "Taraba",

    "yobe state": "Yobe",
    "yobe": "Yobe",

    "zamfara state": "Zamfara",
    "zamfara": "Zamfara",

    "ebonyi state": "Ebonyi",
    "ebonyi": "Ebonyi",

    "gombe state": "Gombe",
    "gombe": "Gombe",

};


export function mapNigeriaState(state) {

    if (!state || typeof state !== "string") {
        return null;
    }


    const normalized = state
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");


    return NIGERIA_STATE_MAP[normalized] || null;

}