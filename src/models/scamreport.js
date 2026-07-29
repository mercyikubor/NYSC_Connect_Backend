import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ScamReport = sequelize.define(
  "ScamReport",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reportedById: {
      // userId of the person filing the report
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    // Generic reference so a report can point at a User, Accommodation,
    // Business, or CommunityPost without needing a separate report table
    // for each entity type.
    targetType: {
      type: DataTypes.ENUM("USER", "ACCOMMODATION", "BUSINESS", "POST"),
      allowNull: false,
    },
    targetId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "RESOLVED", "DISMISSED"),
      defaultValue: "PENDING",
      allowNull: false,
    },
    adminNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    resolvedById: {
      // userId of the Admin who resolved it
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  },
);

export default ScamReport;