import { Sequelize } from "sequelize";
import { User, Business } from "../models/index.js";

// EXPLORE LOGIC ONLY: This finds the nearest shops mapped cleanly by closest categories
export const getNearbyBusinessByGps = async (req, res) => {
  try {
    // Extracted categories parameters to map nearest venues dynamically
    const { lat, lng, radiusInKm = 5, category } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Missing parameters: App interface must provide raw lng & lat params",
      });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const earthRadius = 6371; // KM mapping constant

    // Dynamic constraint block: This Handles broad matching or specific category drilling
    const whereConditions = { isOperational: true };
    if (category) {
      whereConditions.category = category; // Restricts to Restaurant, Supermarket, Foodstuff, Others
    }

    const nearByShops = await Business.findAll({
      where: whereConditions,
      attributes: {
        include: [
          [
            Sequelize.literal(
              `${earthRadius} * acos(cos(radians(${userLat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${userLng})) + sin(radians(${userLat})) * sin(radians(latitude)))`
            ),
            "distance",
          ],
        ],
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["fullName", "email", "phoneNumber"],
        },
      ],
      having: Sequelize.literal(`distance <= ${parseFloat(radiusInKm)}`),
      order: Sequelize.literal("distance ASC"),
    });

    return res.status(200).json({
      success: true,
      count: nearByShops.length,
      data: nearByShops,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};