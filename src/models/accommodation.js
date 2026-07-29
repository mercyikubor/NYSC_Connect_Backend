import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Accommodation = sequelize.define(
  "Accommodation",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    landlordId: {
      // userId of the Landlord who posted it
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pricePerYear: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    imageUrls: {
      type: DataTypes.JSON, // array of image URLs
      allowNull: true,
    },
    verificationStatus: {
      type: DataTypes.ENUM("PENDING", "VERIFIED", "REJECTED"),
      defaultValue: "PENDING",
      allowNull: false,
    },
    rejectionReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

export default Accommodation;