import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const conectarDB = async() => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const newUrl = `conectado en ${db.connection.host}:${db.connection.port}`;
        console.log(`Mongo : ${newUrl}`);
    } catch (error) {
        console.log(`Error ${error.message}`);
        process.exit(1);
    }
}

export default conectarDB;