import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarID from "../helpers/generarID.js";
import registroCorreo from "../helpers/registroCorreo.js";
import olvidePasswordCorreo from "../helpers/olvidePasswordCorreo.js";

const registrar = async (req, res) =>{
    const {email ,nombre} = req.body;
    const emailDuplicado = await Veterinario.findOne({email});
    
    if (emailDuplicado){
        const error = Error('Email ya registrado');
        return res.status(422).json({message: error.message})
    }

    try{
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();
        registroCorreo({
            email,
            nombre,
            token: veterinarioGuardado.token,
        })
        res.status(201).json(veterinarioGuardado);
    }catch(err){
        console.log(err);
    }
}

const perfil = (req, res) =>{
    const {veterinario} = req;
    res.status(200).json(veterinario);
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
            return res.status(404).json({message: error.message});
        }

        // * verificando que este confirmado
        if(!veterinarioExistente.email_confirmado){
            const error = Error('Tu cuenta no ha sido confirmado');
            return res.status(403).json({message: error.message});
        }

        if(await veterinarioExistente.compararPassword(password)){

           return res.status(200).json({
            _id : veterinarioExistente._id,
            nombre : veterinarioExistente.nombre,
            email : veterinarioExistente.email,
            telefono: veterinarioExistente.telefono,
            web : veterinarioExistente.web,
            token : generarJWT(veterinarioExistente.id)
           });

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
        const error = Error('El correo no existe');
        return res.status(404).json({message : error.message});
    }

    try{
        veterinario.token = generarID();
        await veterinario.save();

        //* enviando el correo de reestableceer contraseña
        olvidePasswordCorreo({
            email,
            nombre: veterinario.nombre,
            token: veterinario.token
        });

        return res.status(200).json({message : 'Instrucciones enviadas al correo'});
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

const editarPerfil = async(req, res) => {
    
    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario){
        const error = Error('Hubo un error');
        return res.status(404).json({message: error.message})
    }

    if(veterinario.email != req.body.email){
        const emailRepetido = await Veterinario.findOne({email: req.body.email});
        if(emailRepetido){
            const error = Error('Ese correo ya esta registrado');
            return res.status(403).json({message: error.message})
        }
    }

    try {
        veterinario.nombre = req.body.nombre || veterinario.nombre;
        veterinario.email = req.body.email || veterinario.email;
        veterinario.web = req.body.web || veterinario.web;
        veterinario.telefono = req.body.telefono || veterinario.telefono;
        const {_id, email, web, nombre, __v, telefono } = await veterinario.save();
        return res.status(200).json({_id, email, web, nombre, telefono, __v});
    } catch (error) {
        console.log(error);
    }
} 

const cambiarPassword = async(req, res) =>{
    const {id} = req.veterinario;
    const {pass_nuevo, pass_actual} = req.body;

    const veterinario = await Veterinario.findById(id);
    if(!veterinario){
        const error = Error('No es posible realizar la acción');
        return res.status(404).json({message: error.message})
    }

    if(await veterinario.compararPassword(pass_actual)) {
        veterinario.password = pass_nuevo;
        await veterinario.save()
        return res.status(200).json({message: "Contraseña cambiada"})
    }
    else{
        const error = Error('La contraseña actual es incorrecta');
        return res.status(403).json({message: error.message})
    }
}

export { 
    perfil,
    confirmar,
    registrar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword, 
    editarPerfil,
    cambiarPassword
}