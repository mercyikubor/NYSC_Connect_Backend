import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const LGA = sequelize.define(
  "LGA",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stateId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["name", "stateId"],
      },
    ],
  },
);

export default LGA;
