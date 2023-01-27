import express from "express";
import { actualizarPaciente, agregarPaciente, eliminarPaciente, mostrarPaciente, mostrarPacientes } from "../controllers/pacienteController.js";
import authCheck from "../middleware/authMiddleware.js";


const router = express.Router();


router.route('/')
    .get(authCheck, mostrarPacientes)
    .post(authCheck, agregarPaciente);

router.route('/:id')
    .get(authCheck, mostrarPaciente)
    .put(authCheck, actualizarPaciente)
    .delete(authCheck, eliminarPaciente);
    
export default router;