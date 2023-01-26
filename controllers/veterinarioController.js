import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarID from "../helpers/generarID.js";

const registrar = async (req, res) =>{
    const {email} = req.body;
    const emailDuplicado = await Veterinario.findOne({email});
    
    if (emailDuplicado){
        const error = Error('Email ya registrado');
        return res.status(422).json({message: error.message})
    }

    try{
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();
        res.json(veterinarioGuardado);
    }catch(err){
        console.log(err);
    }
}

const perfil = (req, res) =>{
    const {veterinario} = req;
    res.json({
        perfil : veterinario,
    });
}



const confirmar = async(req, res) => {
    try{
        const {token} = req.params;
        const veterinarioConfirmado = await Veterinario.findOne({token});

        if(!veterinarioConfirmado){
            const error = Error('token no válido');
            return res.status(404).json({message: error.message});
        }

        veterinarioConfirmado.token = null;
        veterinarioConfirmado.email_confirmado = true;
        await veterinarioConfirmado.save();

        return res.status(200).json({message : 'Email confirmado'});
    }catch(error){
        console.log(error);
    }
} 

const autenticar = async(req, res) => {
    try{
        const {email, password }= req.body;
        const veterinarioExistente = await Veterinario.findOne({email});

        //* comprobando si el usuario existe
        if (!veterinarioExistente){
            const error = Error('El usuario no existe');
            return res.status(403).json({message: error.message});
        }

        // * verificando que este confirmado
        if(!veterinarioExistente.email_confirmado){
            const error = Error('El usuario no está autenticado');
            return res.status(403).json({message: error.message});
        }

        if(await veterinarioExistente.compararPassword(password)){
           res.json({token: generarJWT(veterinarioExistente.id)});

        } else {
            const error = Error('La contraseña es incorrecta');
            return res.status(403).json({message: error.message});
        }
    }catch(err){
        console.log(err);
    }
}

const olvidePassword = async(req, res) => {
    const {email} = req.body;
    const veterinario = await Veterinario.findOne({email});
    
    if(!veterinario){
        const error = Error('El correo es inválido');
        return res.status(404).json({message : error.message});
    }

    try{
        veterinario.token = generarID();
        await veterinario.save();
        return res.status(200).json({message : 'Token generado de forma correcta'});
    }catch(err){
        console.log(err);
    }
}
const comprobarToken = async(req, res) => {
    const {token} = req.params;
    const usuarioTokenValido = await Veterinario.findOne({token});
    
    if(usuarioTokenValido){
        return res.status(200).json({message : 'token válido'})
    }else{
        const error = Error('token no inválido');
        return res.status(404).json({message : error.message});
    }
}
const nuevoPassword = async(req, res) => {
    const {password} = req.body;
    const {token} = req.params;

    const veterinario = await Veterinario.findOne({token});
    console.log(veterinario);
    if(!veterinario){
        const error = Error('Hubo un error');
        return res.status(404).json({message : error.message});
    }

    try{
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        return res.status(200).json({message: 'Contraseña cambiada correctamente'})
    }catch(err){
        console.log(err);
    }
}

export {
    perfil,
    confirmar,
    registrar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword
}