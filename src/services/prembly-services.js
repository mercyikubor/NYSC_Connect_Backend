import axios from "axios";

export const verifyNYSC = async (callUpNumber) => {
  try {
    const response = await axios.post(
      "https://api.prembly.com/verification/nysc",

      {
        nysc_number: callUpNumber,
      },
      {
        headers: {
          "x-api-key": process.env.PREMBLY_API_SECRET_KEY,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
