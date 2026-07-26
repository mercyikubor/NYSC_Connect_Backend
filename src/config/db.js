import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
{
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,

    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});

const testConnection = async () => {
    try{
        await sequelize.authenticate();
        console.log("Successfully connected to the cloud db");
    } catch(error){
        console.error("Connection Failed", error);
    }
};

testConnection();

export default sequelize;