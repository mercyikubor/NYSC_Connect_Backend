import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Business = sequelize.define(
  "Business",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    osmId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    osmType: {
      type: DataTypes.ENUM("node", "way", "relation"),
      allowNull: false,
    },
    source: {
      type: DataTypes.ENUM("osm", "manual"),
      defaultValue: "osm",
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    osmCategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.ENUM(
        "Abia",
        "Adamawa",
        "Akwa Ibom",
        "Anambra",
        "Bauchi",
        "Bayelsa",
        "Benue",
        "Borno",
        "Cross River",
        "Delta",
        "Ebonyi",
        "Edo",
        "Ekiti",
        "Enugu",
        "FCT",
        "Gombe",
        "Imo",
        "Jigawa",
        "Kaduna",
        "Kano",
        "Katsina",
        "Kebbi",
        "Kogi",
        "Kwara",
        "Lagos",
        "Nasarawa",
        "Niger",
        "Ogun",
        "Ondo",
        "Osun",
        "Oyo",
        "Plateau",
        "Rivers",
        "Sokoto",
        "Taraba",
        "Yobe",
        "Zamfara",
      ),
      allowNull: true,
    },
    countryCode: {
      type: DataTypes.STRING(2),
      defaultValue: "NG",
      allowNull: false,
    },
    searchName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
      validate: {
        min: -90,
        max: 90,
      },
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
      validate: {
        min: -180,
        max: 180,
      },
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    logoUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    openingHours: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isOperational: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    syncStatus: {
      type: DataTypes.ENUM("active", "failed", "pending"),
      defaultValue: "active",
      allowNull: false,
    },
    lastSynced: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "businesses",
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ["osmType", "osmId"],
      },
      {
        fields: ["category"],
      },
      {
        fields: ["state"],
      },
      {
        fields: ["city"],
      },
      {
        fields: ["featured"]
      },
      {
        fields: ["verified"],
      },
      {
        fields: ["searchName"],
      },
      {
        fields: ["latitude", "longitude"],
      },
      {
        fields: ["syncStatus"],
      },
    ],
  },
);

Business.beforeValidate((business) => {
  if(business.name){
    business.searchName = business.name.toLowerCase().trim();
  }

  if(business.name && !business.slug){
    const city = business.city? `-${business.city.toLowerCase()}` : "";

    business.slug = `${business.name}${city}-${business.osmId}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-");
  }
});

export default Business;
