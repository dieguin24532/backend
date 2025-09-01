import sgMail from "@sendgrid/mail";

const enviarEmail = async (archivo, ticket) => {
  const evento = ticket.evento;
  
  const adjunto = preparaArchivoPDF(archivo, ticket);

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  if(!ticket) {
    throw new Error("No se puede enviar un ticket que no existe"); 
  }

  const msg = {
    to: `${ticket.pedido.email}`,
    from: process.env.SENDGRID_HOST_EMAIL,
    subject: `Tu entrada para el evento ${evento.nombre_evento} está confirmada 🎟`,
    text: "Es un placer darte la bienvenida nuestro Taller de Future Skills",
    html: `<div style="color: #000">

Hola, ${ticket.pedido.cliente}:<br><br>

¡Felicidades! Tu compra para Future Skills 2025 ha sido confirmada.<br>
Tu entrada:
<br>
Adjuntamos tu e-ticket con código QR. Preséntalo desde tu móvil (o impreso) en el ingreso. Recomendamos llegar 30 minutos antes para un registro cómodo.
<br><br>
Qué vas a vivir
Future Skills reúne a tres expertos internacionales para entrenar las habilidades que transforman tu carrera y tu negocio:
	<ul>
    <li>Izanami Martínez - Mentalidad y potencial.</li>
    <li>Karolina Puente - Networking digital de valor.</li>
    <li>Paco Benítez - Comunicación que vende.</li>
  </ul>
<br>
Recomendaciones
<br>
	<ul>
    <li>Lleva tu documento de identidad.</li>
    <li>Ten tu QR a mano.</li>
    <li>Trae libreta o notas digitales: habrá ideas accionables.</li>
  </ul>
<br>
Nos vemos muy pronto. 
El futuro no se improvisa, se entrena.
<br><br>
Equipo Gala Academy.</div>`,

    attachments: [
      adjunto
    ],
    customArgs: {
      correo_id: ticket.id
    }
  };
  await sgMail
    .send(msg)
    .then(() => {
      console.log("Email enviado");
    })
    .catch((error) => {
      throw error;
    });
};

const preparaArchivoPDF = (archivo, ticket) => {
    const PDF = Buffer.from(archivo).toString('base64')
    return {
    content: PDF,
    filename: `${ticket.etiqueta}.pdf`,
    type: 'application/pdf',
    disposition: 'attachment'
  }
}

export { enviarEmail };
