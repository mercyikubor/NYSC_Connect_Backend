import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Property = sequelize.define(
  "Property",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    landlordId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Landlords",
        key: "id",
      },
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lga: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },

    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },

    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    verificationStatus: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
      defaultValue: "PENDING",
    },

    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    images: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    timestamps: true,

    indexes: [
      {
        fields: ["state", "lga"],
      },
      {
        fields: ["isAvailable"],
      },
      {
        fields: ["verificationStatus"],
      },
      {
        fields: ["price"],
      },
    ],
  },
);

export default Property;
