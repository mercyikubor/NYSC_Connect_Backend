import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcryptjs";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      default: DataTypes.UUIDV4,
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
    // Onboarding tracking statuses
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isOnboardingComplete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // NYSC Verification (Nullable at first)
    callUpNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    letterUrl: {
      type: DataTypes.STRING, // For storing the uploaded file link
      allowNull: true,
    },
    batch: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stream: {
      type: DataTypes.ENUM("1", "2"),
      allowNull: true,
    },
    stateCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);
//this runs before a new user is created and the password is hashed before saving it to the database
{
  beforeCreate: async (user) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  };
}

// this runs if a user updates their password,and it hashes the new password before saving it to the database
beforeUpdate: async (user) => {
  if (user.changed("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
};

export default User;
