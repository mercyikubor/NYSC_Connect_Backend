import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Landlord = sequelize.define("Landlord", {
  //Basic Information
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Verification Information
  selfieUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  validIdUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  // Identity verification
  verificationStatus: {
    type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
    defaultValue: "PENDING",
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isIdentityVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // Email verification
  emailVerificationOtp: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  emailVerificationOtpExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  // Password reset
  passwordResetOtp: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  passwordResetOtpExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

export default Landlord;
