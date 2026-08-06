import { body } from "express-validator";

export const validateUpdateCorpProfile = [
  body("stateCode")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("State code cannot be empty"),

  body("batch")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Batch cannot be empty"),

  body("stream")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Stream cannot be empty"),

  body("stateId").optional().isUUID().withMessage("Invalid state ID"),

  body("lgaId").optional().isUUID().withMessage("Invalid LGA ID"),

  body("ppaName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage("PPA name must be between 2 and 255 characters"),
];
