import nodemailer from "nodemailer"

const olvidePasswordCorreo = async (datos) => {
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
    subject: "Recupera tu cuenta en APV", 
    text: "Recupera tu cuenta en APV", 
    html: `<p>Hola ${nombre}, para recuperar tu contraseña sigue el siguiente enlace:
    <a href=${process.env.FRONTEND_URL}/olvide-password/${token}>Reestablece tu contraseña</a></p>
    <p>Si tu no creastes esta cuenta, puedes ignorar este mensaje<p/>`, 
  });

  console.log("Mensaje enviado %s", info.messageId);
}

export default olvidePasswordCorreo;