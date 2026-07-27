import { User, CorpsMember, sequelize } from "../models/index.js";

//   Register a new CorpsMember User and Profile
export const registerCorpsMember = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { userData, corpData } = req.body;

    // Create the parent User account
    const newUser = await User.create(
      {
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        password: userData.password,
        role: "Corps_members",
      },
      { transaction },
    );

    // Create the child CorpMember profile linked via foreign key
    const newProfile = await CorpsMember.create(
      {
        userId: newUser.id,
        stateCode: corpData.stateCode,
        callUpNumber: corpData.callUpNumber,
        deploymentState: corpData.deploymentState,
        ppaName: corpData.ppaName,
        batch: corpData.batch,
        stream: corpData.stream,
        nyscYear: corpData.nyscYear,
      },
      { transaction },
    );

    await transaction.commit();
    return res.status(201).json({
      success: true,
      message: "Corps Member registered successfully",
      data: {
        userId: newUser.id,
        profileId: newProfile.id,
      },
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get a specific CorpsMember profile by ID with its User credentials
export const getCorpProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await CorpsMember.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["email", "role", "createdAt"],
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

//   Update  primary deployment data
export const updateCorpProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { ppaName, verificationStatus } = req.body;

    const [updatedRowsCount] = await CorpMember.update(
      { ppaName, verificationStatus },
      { where: { id } },
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found or no changes were made.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Corp Member profile updated successfully.",
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
    const { id } = req.params;

    // Locate the profile to grab the user_id before deletion
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
