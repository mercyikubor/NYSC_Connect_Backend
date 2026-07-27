import { BOOLEAN, DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { type } from "node:os";
import { timeStamp } from "node:console";

const business = sequelize.define(
    "Business",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        sellerId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: DataTypes.ENUM("Resturant", "Super-Market", "FoodStuffs", "Others"),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        phoneNumber: {
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
            validate: {min: -90, max: 90},
        },
        longitutde: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: false,
            validate: {min: -180, max: 180},
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isOperational: {
            type: BOOLEAN,
            defaultValue: true,
        }
    },
    {
        timeStamp: true,
    }
)

export default business;