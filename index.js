import  express  from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";

const app = express();

//* habilitando la lectura del body de tipo json
app.use(express.json());

//* habilitando el uso de las variables de entorno
dotenv.config();

//* hanilitando el puerto
app.listen(process.env.PORT , ()=>{
    console.log('conectado en el puerto 4000')
});

//* conectando a la base de datos
conectarDB();

//* usando las rutas del api de veterinarios 
app.use('/api/v1/veterinarios', veterinarioRoutes);