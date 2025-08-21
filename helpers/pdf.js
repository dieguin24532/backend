import { PDFDocument, StandardFonts } from "pdf-lib";
import { ticketService } from "../serviceLayer/ticketsService.js";

const generarEntradaPDF = async (ticketId) => {
    try {
        // URL pública del PDF servido en Render
        const pdfUrl = `${process.env.URL_PATH}/docs/TICKET_EXMA.PDF`;

        // Descargar el PDF usando fetch global de Node 18+
        const respuesta = await fetch(pdfUrl);
        if (!respuesta.ok) throw new Error("No se pudo descargar el PDF desde la URL "+ error);

        const pdfArrayBuffer = await respuesta.arrayBuffer();

        // Cargar el PDF
        const pdfDoc = await PDFDocument.load(pdfArrayBuffer);

        const paginas = pdfDoc.getPages();
        const primeraPagina = paginas[0];

        // Obtener ticket desde servicio
        const ticket = await ticketService.obtenerTicketById(ticketId);

        // Fuente por defecto
        const fuente = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Procesar imagen QR
        const imagenBase64Compuesta = ticket.codigo_qr;
        const imagenBase64 = imagenBase64Compuesta.split(",")[1];
        const imagenBinaria = base64Bytes(imagenBase64);
        const codigoQRImagen = await pdfDoc.embedPng(imagenBinaria);
        const DimensionesImagen = codigoQRImagen.scale(2.4);

        primeraPagina.drawImage(codigoQRImagen, {
            x: primeraPagina.getWidth() / 2 - DimensionesImagen.width / 2,
            y: 0,
            width: DimensionesImagen.width,
            height: DimensionesImagen.height
        });

        // Texto Butaca
        const textoEtiqueta = fuente.widthOfTextAtSize(`Butaca: ${ticket.etiqueta}`, 20);
        primeraPagina.drawText(`Butaca: ${ticket.etiqueta}`, {
            x: (primeraPagina.getWidth() - textoEtiqueta) / 2,
            y: primeraPagina.getHeight() / 2 - 140,
            size: 20
        });

        // Texto Localidad
        const textoLocalidad = fuente.widthOfTextAtSize(`Localidad: ${ticket.localidad}`, 20);
        primeraPagina.drawText(`Localidad: ${ticket.localidad}`, {
            x: (primeraPagina.getWidth() - textoLocalidad) / 2,
            y: primeraPagina.getHeight() / 2 - 170,
            size: 20
        });

        const PDF = await pdfDoc.save();
        return { PDF, ticket };

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
}

export { generarEntradaPDF }