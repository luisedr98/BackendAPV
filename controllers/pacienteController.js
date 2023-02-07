import Paciente from "../models/Pacientes.js";

const agregarPaciente = async (req, res) => {
    try {
        const nuevoPaciente = new Paciente(req.body);
        nuevoPaciente.veterinario = req.veterinario._id;
        console.log(nuevoPaciente);
        const pacienteAlmacenado = await nuevoPaciente.save();
        res.status(201).json(pacienteAlmacenado);
    } catch (err) {
        console.log(err);
    }
};

const mostrarPacientes = async (req, res) => {
    const pacientes = await Paciente.find()
        .where("veterinario")
        .equals(req.veterinario);
    res.status(200).json( pacientes );
};


const mostrarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);
    if (!paciente) return res.status(404).json({ message: "No existe el paciente" });

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res
            .status(403)
            .json({ message: "No está autorizado para acceder a estos datos" });
    } else
        return res.status(200).json(paciente);

};

const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if (!paciente) return res.status(404).json({ message: "No existe el paciente" });

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res
            .status(403)
            .json({ message: "No está autorizado para acceder a estos datos" });
    }

    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save();
        return res.status(200).json(pacienteActualizado);
    } catch (error) {
        console.log(error);
    }
};


const eliminarPaciente = async (req, res) => { 
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if (!paciente) return res.status(404).json({ message: "No existe el paciente" });

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res
            .status(403)
            .json({ message: "No está autorizado para acceder a estos datos" });
    }

    try {
        await paciente.deleteOne();
        return res.status(200).json({message : 'Paciente eliminado'});
    } catch (error) {
        console.log(error)
    }
};

export {
    agregarPaciente,
    mostrarPacientes,
    mostrarPaciente,
    actualizarPaciente,
    eliminarPaciente,
};
