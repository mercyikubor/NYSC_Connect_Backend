import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Landlord = sequelize.define("Landlord", {
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
    validate: {
      isEmail: true,
    },
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  selfieUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  validIdUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  verificationStatus: {
    type: DataTypes.ENUM(
      "PENDING",
      "APPROVED",
      "REJECTED"
    ),
    defaultValue: "PENDING",
  },

  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  verifiedBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
});

export default Landlord;