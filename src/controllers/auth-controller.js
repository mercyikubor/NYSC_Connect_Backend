import { registerCorpsMember } from "../services/auth-services.js";
import { validationResult } from "express-validator";

export const registerCorpsMemberController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  try {
    const result = await registerCorpsMember(req.body);

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
