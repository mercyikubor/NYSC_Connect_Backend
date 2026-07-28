import { User, CorpsMemberProfile } from "../models/index.js";

/**
 * Get posting details (state of deployment, state code, NYSC year) for all
 * users with the "Alumni" role.
 *
 * @returns {Promise<Array<{
 *   userId: string,
 *   fullName: string,
 *   email: string,
 *   stateOfDeployment: string,
 *   stateCode: string,
 *   nyscYear: number
 * }>>}
 */
export const getAlumniPostingDetails = async () => {
  const alumni = await User.findAll({
    where: { role: "Alumni" },
    attributes: ["id", "fullName", "email"],
    include: [
      {
        model: CorpsMemberProfile,
        as: "profile",
        attributes: ["stateOfDeployment", "stateCode", "nyscYear"],
        required: true, // inner join — skips alumni with no profile record
      },
    ],
  });

  return alumni.map((user) => ({
    userId: user.id,
    fullName: user.fullName,
    email: user.email,
    stateOfDeployment: user.profile.stateOfDeployment,
    stateCode: user.profile.stateCode,
    nyscYear: user.profile.nyscYear,
  }));
};

/**
 * Get posting details for a single Alumni user by ID.
 *
 * @param {string} userId
 * @returns {Promise<{
 *   userId: string,
 *   fullName: string,
 *   email: string,
 *   stateOfDeployment: string,
 *   stateCode: string,
 *   nyscYear: number
 * }>}
 */
export const getAlumniPostingDetailsById = async (userId) => {
  if (!userId) {
    throw new Error("A valid user ID must be provided.");
  }

  const user = await User.findOne({
    where: { id: userId, role: "Alumni" },
    attributes: ["id", "fullName", "email"],
    include: [
      {
        model: CorpsMemberProfile,
        as: "profile",
        attributes: ["stateOfDeployment", "stateCode", "nyscYear"],
        required: true,
      },
    ],
  });

  if (!user) {
    throw new Error(`No Alumni profile found for user ID: ${userId}`);
  }

  return {
    userId: user.id,
    fullName: user.fullName,
    email: user.email,
    stateOfDeployment: user.profile.stateOfDeployment,
    stateCode: user.profile.stateCode,
    nyscYear: user.profile.nyscYear,
  };
};