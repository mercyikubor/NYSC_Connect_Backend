import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcrypt";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    // Sign up
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(
        "Corps_members",
        "Landlords",
        "Alumni",
        "Business",
        "Admin",
      ),
      allowNull: false,
      defaultValue: "Corps_members",
    },
    // Email Verification
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    emailVerificationOtp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailVerificationOtpExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passwordResetOtp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordResetOtpExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Onboarding Tracking
    isOnboardingComplete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    //this runs before a new user is created and the password is hashed before saving it to the database
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      // this runs if a user updates their password,and it hashes the new password before saving it to the database
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  },
);

export default User;
