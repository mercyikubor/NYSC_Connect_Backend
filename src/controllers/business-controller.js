import { Sequelize } from "sequelize";
import Business from "../models/business.js";
import { fetchNearbyBusinesses } from "../services/overpassService.js";

export const getNearbyBusinessByGps = async (req, res) => {
  try {
    const { lat, lng, category } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required.",
      });
    }

    const radiusKm = Math.min(Number(req.query.radiusInKm) || 1, 5);

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const earthRadius = 6371;

    const whereConditions = { isOperational: true };

    if (category) {
      whereConditions.category = category;
    }

    const businesses = await Business.findAll({
      where: whereConditions,
      attributes: {
        include: [
          [
            Sequelize.literal(`
              ${earthRadius} * acos(
                cos(radians(${userLat})) *
                cos(radians(latitude)) *
                cos(radians(longitude) - radians(${userLng})) +
                sin(radians(${userLat})) *
                sin(radians(latitude))
              )
            `),
            "distance",
          ],
        ],
      },
      having: Sequelize.literal(`distance <= ${radiusKm}`),
      order: [[Sequelize.literal("distance"), "ASC"]],
    });

    if (businesses.length > 0) {
      return res.status(200).json({
        success: true,
        source: "database",
        count: businesses.length,
        data: businesses,
      });
    }

    const radiusMeters = radiusKm * 1000;

    const osmBusinesses = await fetchNearbyBusinesses(
      userLat,
      userLng,
      radiusMeters,
    );

    if (osmBusinesses.length > 0) {
      await Business.bulkCreate(osmBusinesses, {
        ignoreDuplicates: true,
      });
    }

    return res.status(200).json({
      success: true,
      source: "openstreetmap",
      count: osmBusinesses.length,
      data: osmBusinesses,
    });
  } catch (error) {
    console.error("Nearby Business Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch nearby businesses",
      error: error.message,
    });
  }
};
