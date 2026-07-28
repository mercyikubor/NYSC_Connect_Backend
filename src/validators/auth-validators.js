import { body } from "express-validator";

export const validateCorpsMemberRegistration = [
  body("fullName").notEmpty().withMessage("Full name is requires"),

  body("email").isEmail().withMessage("Please provide a valid email address"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  body("callUpNumber").notEmpty().withMessage("Call-up number is required"),
];
