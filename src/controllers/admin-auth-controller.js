import { loginAdmin } from "../services/admin-auth-services.js";

export const loginAdminController = async (req, res, next) => {
  try {
    const result = await loginAdmin(req.body);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
