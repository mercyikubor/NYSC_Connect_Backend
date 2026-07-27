import {
  getAlumniPostingDetails,
  getAlumniPostingDetailsById,
} from "../services/alumniServices.js";


//   GET /api/alumni
//   Returns posting details (state of deployment, state code, service year)
//   for every Alumni user.
 
export const getAllAlumni = async (req, res) => {
  try {
    const alumni = await getAlumniPostingDetails();
    res.status(200).json({ success: true, data: alumni });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


//   GET /api/alumni/:userId
//  Returns posting details for a single Alumni user.

export const getAlumniById = async (req, res) => {
  const { userId } = req.params;

  try {
    const alumnus = await getAlumniPostingDetailsById(userId);
    res.status(200).json({ success: true, data: alumnus });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};