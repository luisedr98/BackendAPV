import  express  from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";

const app = express();


//* habilitando el uso de las variables de entorno
dotenv.config();

//* hanilitando el puerto
app.listen(process.env.PORT , ()=>{
    console.log('conectado en el puerto 4000')
});

//* conectando a la base de datos
conectarDB();

//* habilitando la lectura del body de tipo json
app.use(express.json());

//* usando las rutas del api de veterinarios y pacientes
app.use('/api/v1/veterinarios', veterinarioRoutes);
app.use('/api/v1/pacientes', pacienteRoutes);