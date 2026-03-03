import sgMail from "@sendgrid/mail";

/**
 * Genera el archivo PDf, y lo envía al correo electrónico del cliente
 */
const enviarEmail = async (archivo, ticket) => {
  const evento = ticket.evento;

  const adjunto = preparaArchivoPDF(archivo, ticket);

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  if (!ticket) {
    throw new Error("No se puede enviar un ticket que no existe");
  }

  const msg = {
    to: `${ticket.pedido.email}`,
    from: process.env.SENDGRID_HOST_EMAIL,
    subject: `Tu entrada para el evento ${evento.nombre_evento} está confirmada 🎟`,
    text: "Es un placer darte la bienvenida nuestro Taller de Ventas Salvajes 2",
    html: `<div style="color: #000">

    Hola, ${ticket.pedido.cliente}:<br><br>

    ¡Felicidades! Tu compra para Ventas Salvajes 2 con Sandro Meléndez ha sido confirmada.<br>
    Tu entrada:
    <br>
    Adjuntamos tu e-ticket con código QR. Preséntalo desde tu móvil (o impreso) en el ingreso. Recomendamos llegar 30 minutos antes para un registro cómodo.
    <br><br>
    Qué vas a vivir<br>
    El entrenamiento en ventas más poderoso de Latinoamérica llega con una nueva edición cargada de estrategia, impacto y resultados reales.
    Sandro Meléndez el master trainer más influyente de la región vuelve con Ventas Salvajes 2, un entrenamiento renovado que parte de su nuevo libro y que ya ha transformado a más de 7.000 vendedores y equipos en Colombia y Ecuador.
    <br>
    Prepárate para un evento donde no solo aprenderás a vender… 
    <br>aprenderás a cerrar sin miedo, sin excusas y con resultados medibles.
    <br>
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
    <br><br>
    Equipo Gala Academy.</div>`,

    attachments: [adjunto],
    customArgs: {
      correo_id: ticket.id,
    },
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

/**
 * Genera el archivo PDF, recibe el archivo y lo transforma
 */
const preparaArchivoPDF = (archivo, ticket) => {
  const PDF = Buffer.from(archivo).toString("base64");
  return {
    content: PDF,
    filename: `${ticket.etiqueta}.pdf`,
    type: "application/pdf",
    disposition: "attachment",
  };
};

export { enviarEmail };
