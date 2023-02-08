import Paciente from "../models/Pacientes.js";

const agregarPaciente = async (req, res) => {
    try {
        const nuevoPaciente = new Paciente(req.body);
        nuevoPaciente.veterinario = req.veterinario._id;
        const pacienteAlmacenado = await nuevoPaciente.save();
        return res.status(201).json(pacienteAlmacenado);
    } catch (err) {
        console.log(err);
        const error = Error('No se pudo agregar al paciente');
        return res.status(500).json({message : error.message});
    }
};

const mostrarPacientes = async (req, res) => {
    try {
    const pacientes = await Paciente.find()
        .where("veterinario")
        .equals(req.veterinario);
    return res.status(200).json( pacientes );
    } catch (e) {
        console.log(e);
        const error = Error('Error en el servidor');
        return res.status(500).json({message : error.message});
    }
};


const mostrarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if (!paciente) {
        const error = Error('El paciente no existe');
        return res.status(404).json({ message: error.message })
    };

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        const error = Error('No está autorizado para acceder a estos datos');
        return res
            .status(403)
            .json({ message: error.message });
    } else
        return res.status(200).json(paciente);

};

const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if (!paciente) {
        const error = Error("No existe el paciente");
        return res.status(404).json({ message: error.message });
    }

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        const error = Error("No está autorizado para acceder a estos datos");

        return res
            .status(403)
            .json({ message:  error.message});
    }

    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save();
        return res.status(200).json(pacienteActualizado);
    } catch (e) {
        console.log(e);
        const error = Error('Error en el servidor');
        return res.status(500).json({message : error.message});
    }
};


const eliminarPaciente = async (req, res) => { 
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if (!paciente){
        const error = Error("No existe el paciente")
        return res.status(404).json({ message:  error.message});
    } 

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        const error = Error("No está autorizado para acceder a estos datos");
        return res
            .status(403)
            .json({ message: error.message });
    }

    try {
        await paciente.deleteOne();
        return res.status(200).json({message : 'Paciente eliminado'});
    } catch (e) {
        console.log(e);
        const error = Error('Error en el servidor');
        return res.status(500).json({message : error.message});
    }
};

export {
    agregarPaciente,
    mostrarPacientes,
    mostrarPaciente,
    actualizarPaciente,
    eliminarPaciente,
};
