import nodemailer from "nodemailer"

const registroCorreo = async (datos) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const {nombre, email, token} = datos;

  const info = await transporter.sendMail({
    from: 'Administrador de Pacientes de Veterinaria - APV',
    to: `${email}`,
    subject: "Confirma tu cuenta APV", 
    text: "Confirma tu cuenta", 
    html: `<p>Hola ${nombre}, confirma tu cuenta en el siguiente enlace:
    <a href=${process.env.FRONTEND_URL}/confirmar/${token}>Comprueba tu cuenta</a></p>
    <p>Si tu no creastes esta cuenta, puedes ignorar este mensaje<p/>`, 
  });

  console.log("Mensaje enviado %s", info.messageId);
}

export default registroCorreo;