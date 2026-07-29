import NodeGeocoder from "node-geocoder";
import { User, Business, sequelize } from "../models/index.js";

const geocoder = NodeGeocoder({
  provider: "openstreetmap",
});

export const createBusiness = async (req, res) => {
  console.log("INCOMING HEADERS:", req.headers);
  console.log("INCOMING BODY:", req.body);

  try {
    const { name, category, description, phoneNumber, address, sellerId } =
      req.body;
    let { longitude, latitude } = req.body;

    if (!latitude || !longitude) {
      if (!address) {
        return res.status(400).json({
          success: false,
          message: "Provide an address.",
        });
      }

      const optimizedAddress = address.toLowerCase().includes("nigeria")
        ? address
        : `${address}, Nigeria`;

      const geoResult = await geocoder.geocode(optimizedAddress);

      if (!geoResult || geoResult.length === 0) {
        return res.status(422).json({
          success: false,
          message: "We couldn't locate the address.",
        });
      }

      latitude = geoResult[0].latitude;
      longitude = geoResult[0].longitude;
    }

    const imageUrl = req.file ? req.file.path : null;

    const newBusiness = await business.create({
      sellerId,
      name,
      category,
      phoneNumber,
      address,
      description,
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Business registered successfully",
      data: newBusiness,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Find the nearest shop to the user
export const getNearbyBusinessByGps = async (req, res) => {
  try {
    const { lat, lng, radiusInKm = 5 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message:
          "Missing parameters: App interface must provide raw lng & lat params",
      });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const earthRadius = 6371; // KM

    const nearByShops = await business.findAll({
      where: { isOperational: true },
      attributes: {
        include: [
          [
            Sequelize.literal(
              `${earthRadius} * acos(cos(radians(${userLat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${userLng})) + sin(radians(userLat)) * sin(radians(latitude)))`,
            ),
            "distance",
          ],
        ],
      },
      include: [
        {
          model: User,
          as: "sellerInfo",
          attributes: ["name", "email", "phoneNumber"],
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
