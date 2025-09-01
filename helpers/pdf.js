import { PDFDocument, StandardFonts } from "pdf-lib";
import { ticketService } from "../serviceLayer/ticketsService.js";

const generarEntradaPDF = async (ticketId) => {
  try {
    // URL pública del PDF servido en Render
    const pdfUrl = `${process.env.URL_PATH}/docs/future-skills.pdf`;

    // Descargar el PDF usando fetch global de Node 18+
    const respuesta = await fetch(pdfUrl);
    if (!respuesta.ok)
      throw new Error("No se pudo descargar el PDF desde la URL ");

    const pdfArrayBuffer = await respuesta.arrayBuffer();

    // Cargar el PDF
    const pdfDoc = await PDFDocument.load(pdfArrayBuffer);

    const paginas = pdfDoc.getPages();
    const primeraPagina = paginas[0];

    // Obtener ticket desde servicio
    const ticket = await ticketService.obtenerTicketById(ticketId);
    console.log(ticket);

    // Fuente por defecto
    const fuente = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Procesar imagen QR

    if (!ticket) {
      throw new Error("Error no existe el ticket");
    }

    const imagenBase64Compuesta = ticket.codigo_qr;
    const imagenBase64 = imagenBase64Compuesta.split(",")[1];
    const imagenBinaria = base64Bytes(imagenBase64);
    const codigoQRImagen = await pdfDoc.embedPng(imagenBinaria);
    const dimensionesImagen = codigoQRImagen.scale(2.0);

    primeraPagina.drawImage(codigoQRImagen, {
      x: primeraPagina.getWidth() / 2 - dimensionesImagen.width / 2,
      y: -10,
      width: dimensionesImagen.width,
      height: dimensionesImagen.height,
    });

    // Texto Evento
    const textoEvento = fontBold.widthOfTextAtSize(
      `${ticket.evento.nombre_evento}`,
      24
    );
    primeraPagina.drawText(`${ticket.evento.nombre_evento}`, {
      x: (primeraPagina.getWidth() - textoEvento) / 2,
      y: primeraPagina.getHeight() / 2 - 140,
      size: 24,
      font: fontBold,
    });
    const textoCliente = fontBold.widthOfTextAtSize(
      `${ticket.pedido.cliente}`,
      20
    );
    primeraPagina.drawText(`${ticket.pedido.cliente}`, {
      x: (primeraPagina.getWidth() - textoCliente) / 2,
      y: primeraPagina.getHeight() / 2 - 200,
      size: 20,
      font: fontBold,
    });

    // Texto Localidad
    const textoLocalidad = fuente.widthOfTextAtSize(
      `${ticket.localidad.nombre}`,
      16
    );

    primeraPagina.drawText(`${ticket.localidad.nombre}`, {
      x: (primeraPagina.getWidth() - textoLocalidad) / 2,
      y: primeraPagina.getHeight() / 2 - 230,
      size: 16,
    });

    // Texto Butaca
    const textoEtiqueta = fuente.widthOfTextAtSize(
      `Butaca: ${ticket.etiqueta}`,
      16
    );
    
    primeraPagina.drawText(`Butaca: ${ticket.etiqueta}`, {
      x: (primeraPagina.getWidth() - textoEtiqueta) / 2,
      y: primeraPagina.getHeight() / 2 - 250,
      size: 16,
    });

    const PDF = await pdfDoc.save();
    return PDF;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default generarEntradaPDF;

const base64Bytes = (cadenaBase64) => {
  const cadenaBinaria = atob(cadenaBase64);
  const bytes = new Uint8Array(cadenaBinaria.length);
  for (let i = 0; i < cadenaBinaria.length; i++) {
    bytes[i] = cadenaBinaria.charCodeAt(i);
  }

  return bytes;
};

export { generarEntradaPDF };
