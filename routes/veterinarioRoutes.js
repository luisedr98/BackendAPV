import express from "express";
import { perfil, registrar, confirmar, olvidePassword, comprobarToken, nuevoPassword, autenticar } from "../controllers/veterinarioController.js";
import authCheck from "../middleware/authMiddleware.js";

const router = express.Router();

//* area privada
router.get('/perfil', authCheck, perfil);

//* area publica
router.post('/', registrar);
router.post('/login', autenticar);
router.get('/confirmar/:token', confirmar);
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

export default router;