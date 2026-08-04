import { User, CorpsMember, State, LGA } from "../models/index.js";
import { validationResult } from "express-validator";

// Get all Corps Member profiles with their User credentials
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
     console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get a specific Corps Member profile by ID with its User credentials
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

//   Update  Corps member profile
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

    const profile = await CorpsMember.findOne({ where: { userId } });
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
    return res.status(200).json({
      success: true,
      message: "Corp Member profile updated successfully.",
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete CorpsMember account completely from the system
export const deleteCorpProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profile = await CorpsMember.findOne({ where: { userId } });
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
