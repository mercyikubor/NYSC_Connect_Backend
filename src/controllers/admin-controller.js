import { Property, Landlord } from "../models/index.js";

export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.findAll({
      include: [
        {
          model: Landlord,
          as: "landlord",
          attributes: ["id", "fullName", "email", "phone"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
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
        message: "Status must be 'APPROVED' or 'REJECTED'",
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
        status === "REJECTED" ? rejectionReason || "Property rejected" : null,
    });

    return res.status(200).json({
      success: true,
      message: `Property ${status} successfully`,
      data: property,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getAllLandlords = async (req, res) => {
  try {
    const landlords = await Landlord.findAll({
      attributes: {
        exclude: ["password"],
      },
    });

    return res.status(200).json({
      success: true,
      count: landlords.length,
      data: landlords,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const approveLandlord = async (req, res) => {
  try {
    const landlord = await Landlord.findByPk(req.params.id);

    if (!landlord) {
      return res.status(404).json({
        success: false,
        message: "Landlord not found",
      });
    }

    await landlord.update({
      verificationStatus: "APPROVED",
      isVerified: true,
    });

    return res.status(200).json({
      success: true,
      message: "Landlord approved successfully",
      data: landlord,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const rejectLandlord = async (req, res) => {
  try {
    const landlord = await Landlord.findByPk(req.params.id);

    if (!landlord) {
      return res.status(404).json({
        success: false,
        message: "Landlord not found",
      });
    }

    await landlord.update({
      verificationStatus: "REJECTED",
      isVerified: false,
    });

    return res.status(200).json({
      success: true,
      message: "Landlord rejected successfully",
      data: landlord,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalProperties = await Property.count();
    const pending = await Property.count({
      where: { verificationStatus: "PENDING" },
    });
    const approved = await Property.count({
      where: { verificationStatus: "APPROVED" },
    });
    const rejected = await Property.count({
      where: { verificationStatus: "REJECTED" },
    });
    const landlords = await Landlord.count();

    return res.status(200).json({
      success: true,
      data: {
        totalProperties,
        pending,
        approved,
        rejected,
        landlords,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
