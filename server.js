import app from './src/app.js';
import sequelize from './src/config/db.js';
import 'dotenv/config';

const PORT = process.env.PORT;

const startServer = async() => {
    try{
        console.log("Syncing DB models");
        await sequelize.sync();
        console.log("DB models synced successfully")

        app.listen(PORT, () => {
            console.log(`Server is running on: http://localhost:${PORT}`);
        });
    }catch(error){
        console.error("Server failed to initialize:", error);
        process.exit(1);
    }
};
startServer();