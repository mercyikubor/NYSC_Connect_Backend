import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",

    logging:
      process.env.NODE_ENV === "development"
        ? console.log
        : false,

    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },

    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  }
);

/**
 * Connect Database
 */
export const connectDB = async () => {
  try {
    await sequelize.authenticate();

    console.log("====================================");
    console.log("✅ MySQL Connected Successfully");
    console.log(`Database : ${process.env.DB_NAME}`);
    console.log(`Host     : ${process.env.DB_HOST}`);
    console.log(`Port     : ${process.env.DB_PORT}`);
    console.log("====================================");
  } catch (error) {
    console.error("====================================");
    console.error("Database Connection Failed");
    console.error(error.message);
    console.error("====================================");
    process.exit(1);
  }
};

export default sequelize;