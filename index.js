import  express  from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";

const app = express();


//* habilitando el uso de las variables de entorno
dotenv.config();

//* hanilitando el puerto
app.listen(process.env.PORT , ()=>{
    console.log('conectado en el puerto %s', process.env.PORT)
});

//* conectando a la base de datos
conectarDB();

//* habilitando la lectura del body de tipo json
app.use(express.json());

//* configuracion de cors
const dominiosPermitidos =[
    process.env.FRONTEND_URL
];

const corsOptions = {
    origin : function(origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            callback(null, true);
        }else{
            callback(new Error('No permitido por CORS'))
        }
    }
}

app.use(cors(corsOptions));

//* usando las rutas del api de veterinarios y pacientes
app.use('/api/v1/veterinarios', veterinarioRoutes);
app.use('/api/v1/pacientes', pacienteRoutes);