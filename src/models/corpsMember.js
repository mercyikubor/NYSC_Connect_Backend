import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CorpsMemberProfile = sequelize.define(
  "CorpsMemberProfile",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "Users",
        key: "id",
      },
    },

    callUpNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    callUpLetterUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    batch: {
      type: DataTypes.ENUM("Batch A", "Batch B", "Batch C"),
      allowNull: false,
    },

    stream: {
      type: DataTypes.ENUM("Stream 1", "Stream 2"),
      allowNull: false,
    },
    stateOfDeployment: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    stateCode: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    nyscYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    verificationStatus: {
      type: DataTypes.ENUM("PENDING", "VERIFIED", "REJECTED"),
      defaultValue: "PENDING",
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

export default CorpsMemberProfile;
