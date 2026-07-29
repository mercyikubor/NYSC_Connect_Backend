import { body } from "express-validator";

export const validateCorpsMemberRegistration = [
  body("fullName").notEmpty().withMessage("Full name is requires"),

  body("email").isEmail().withMessage("Please provide a valid email address"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  body("callUpNumber").notEmpty().withMessage("Call-up number is required"),
];

export const verifyEmailValidator = [
  body("email").isEmail().withMessage("Please provide a valid email address"),

  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits"),
];

export const validateLogin = [
  body("email").isEmail().withMessage("Please provide a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),
];

export const validatePasswordResetRequest = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address."),
];

export const validateResetPassword = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address."),

  body("otp").notEmpty().withMessage("OTP is required."),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
];
