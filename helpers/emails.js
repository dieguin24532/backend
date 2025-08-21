import sgMail from "@sendgrid/mail";

const enviarEmail = async (archivo, ticket) => {
  const pedido = ticket.pedido;
  const evento = ticket.evento;
  
  const adjunto = preparaArchivoPDF(archivo, ticket);

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    //TODO: Cambiar el email a dinámico
    to: "dieguin24532tc@gmail.com",
    from: process.env.SENDGRID_HOST_EMAIL,
    subject: `Entrada para el evento ${evento.nombre_evento}`,
    text: "Es un placer darte la bienvenida nuestro Taller de Future Skills",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    attachments: [
      adjunto
    ]
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email enviado");
    })
    .catch((error) => {
      console.error(error);
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
