import { User, CorpsMember, State, LGA } from "../models/index.js";
import { validationResult } from "express-validator";

// Admin can get all Corps Member profiles
export const getAllCorpProfiles = async (req, res) => {
  try {
    const profiles = await CorpsMember.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["email", "role", "createdAt"],
        },
        {
          model: State,
          as: "state",
          attributes: ["id", "name"],
        },
        {
          model: LGA,
          as: "lga",
          attributes: ["id", "name"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// Admin can get a specific corps member profile by ID
export const getSingleCorpProfileByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await CorpsMember.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["email", "role", "createdAt"],
        },
        {
          model: State,
          as: "state",
          attributes: ["id", "name"],
        },
        {
          model: LGA,
          as: "lga",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Corps Member profile not found.",
      });
    }
    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Admin can update a corps member profile by ID
export const updateCorpProfileByAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  try {
    const { id } = req.params;
    const { stateCode, batch, stream, stateId, lgaId, ppaName } = req.body;

    const profile = await CorpsMember.findByPk(id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Corp Member profile not found.",
      });
    }
    await profile.update({
      stateCode,
      batch,
      stream,
      stateId,
      lgaId,
      ppaName,
    });

    const updatedProfile = await CorpsMember.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["email", "role", "createdAt"],
        },
        {
          model: State,
          as: "state",
          attributes: ["id", "name"],
        },
        {
          model: LGA,
          as: "lga",
          attributes: ["id", "name"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Corp Member profile updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Admin can delete CorpsMember account completely from the system
export const deleteCorpProfileByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await CorpsMember.findByPk(id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Corp Member profile not found.",
      });
    }
    await User.destroy({ where: { id: profile.userId } });
    return res.status(200).json({
      success: true,
      message: "Corp Member account and profile deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// corps member can get their own profile
export const getCorpProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profile = await CorpsMember.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["email", "role", "createdAt"],
        },
        {
          model: State,
          as: "state",
          attributes: ["id", "name"],
        },
        {
          model: LGA,
          as: "lga",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Corp Member profile not found.",
      });
    }
    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//   Update Corps member profile
export const updateCorpProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  try {
    const userId = req.user.userId;
    const { stateCode, batch, stream, stateId, lgaId, ppaName } = req.body;
    const profile = await CorpsMember.findOne({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Corp Member profile not found.",
      });
    }

    await profile.update({
      stateCode,
      batch,
      stream,
      stateId,
      lgaId,
      ppaName,
    });

    const updatedProfile = await CorpsMember.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["email", "role", "createdAt"],
        },
        {
          model: State,
          as: "state",
          attributes: ["id", "name"],
        },
        {
          model: LGA,
          as: "lga",
          attributes: ["id", "name"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Corp Member profile updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
