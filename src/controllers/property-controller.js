import { Op } from "sequelize";
import { Property, Landlord } from "../models/index.js";
import cloudinary from "../config/cloudinary.js";

export const createProperty = async (req, res) => {
  try {
    const images = req.files
      ? req.files.map((file) => ({
          url: file.path,
          public_id: file.filename,
        }))
      : [];

    const property = await Property.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      state: req.body.state,
      lga: req.body.lga,
      address: req.body.address,

      latitude: req.body.latitude,
      longitude: req.body.longitude,

      landlordId: req.user.landlordId,

      images,
      verificationStatus: "PENDING",
    });

    return res.status(201).json({
      success: true,
      message: "Property created successfully.",
      data: property,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getProperties = async (req, res) => {
  try {
    const {
      state,
      lga,
      minPrice,
      maxPrice,
      isAvailable,
      page = 1,
      limit = 10,
    } = req.query;

    const whereClause = {
      verificationStatus: "APPROVED",
    };

    if (state) {
      whereClause.state = {
        [Op.like]: `%${state}%`,
      };
    }

    if (lga) {
      whereClause.lga = {
        [Op.like]: `%${lga}%`,
      };
    }

    if (isAvailable !== undefined) {
      whereClause.isAvailable = isAvailable === "true";
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};

      if (minPrice) {
        whereClause.price[Op.gte] = Number(minPrice);
      }

      if (maxPrice) {
        whereClause.price[Op.lte] = Number(maxPrice);
      }
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Property.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Landlord,
          as: "landlord",
          attributes: ["id", "fullName", "email", "phone"],
        },
      ],
      limit: Number(limit),
      offset: Number(offset),
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: rows.length,
      total: count,
      page: Number(page),
      pages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id, {
      include: [
        {
          model: Landlord,
          as: "landlord",
          attributes: ["id", "fullName", "email", "phone"],
        },
      ],
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (property.landlordId !== req.user.landlordId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const resetFields = [
      "title",
      "description",
      "price",
      "address",
      "state",
      "lga",
      "latitude",
      "longitude",
    ];

    const hasCoreUpdate = resetFields.some(
      (field) => req.body[field] !== undefined,
    );

    const updateData = {
      ...req.body,
    };

    if (hasCoreUpdate) {
      updateData.verificationStatus = "PENDING";
      updateData.rejectionReason = null;
    }

    await property.update(updateData);

    return res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (
      property.landlordId !== req.user.landlordId &&
      req.user.role !== "Admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this property",
      });
    }

    if (property.images && Array.isArray(property.images)) {
      for (const img of property.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    await property.destroy();

    return res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const verifyProperty = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    await property.update({
      verificationStatus: status,
      rejectionReason:
        status === "REJECTED" ? rejectionReason || "Failed verification" : null,
    });

    return res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: {
        landlordId: req.user.landlordId,
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
