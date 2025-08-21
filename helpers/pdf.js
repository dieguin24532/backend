import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { ticketService } from '../serviceLayer/ticketsService.js';

// Necesario para obtener __dirname con ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generarEntradaPDF = async (ticketId) => {
    try {
        const pdfPath = path.resolve(__dirname, '../docs/TICKET_EXMA.PDF');
        const pdfBase = fs.readFileSync(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBase);

        const paginas = pdfDoc.getPages();
        const primeraPagina = paginas[0];
        let ticket = await ticketService.obtenerTicketById(ticketId);

        // Cargar fuente por defecto (Helvetica)
        const fuente = await pdfDoc.embedFont(StandardFonts.Helvetica);


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

        const textoEtiqueta = fuente.widthOfTextAtSize(`Butaca: ${ticket.etiqueta}`, 20);

        primeraPagina.drawText(
            `Butaca: ${ticket.etiqueta}`,
            {
                x: (primeraPagina.getWidth() - textoEtiqueta) / 2,
                y: primeraPagina.getHeight() / 2 - 140,
                size: 20
            });


        const textoLocalidad = fuente.widthOfTextAtSize(`Localidad: ${ticket.localidad}`, 20)
        primeraPagina.drawText(
            `Localidad: ${ticket.localidad}`,
            {
                x: (primeraPagina.getWidth() - textoLocalidad) / 2,
                y: primeraPagina.getHeight() / 2 - 170,
                size: 20
            });


        const PDF = await pdfDoc.save();
        return {PDF, ticket};

    } catch (error) {
        console.log(error);
    }
}


const base64Bytes = (cadenaBase64) => {
    const cadenaBinaria = atob(cadenaBase64);
    const bytes = new Uint8Array(cadenaBinaria.length);
    for (let i = 0; i < cadenaBinaria.length; i++) {
        bytes[i] = cadenaBinaria.charCodeAt(i);
    }

    return bytes;
}

export { generarEntradaPDF }