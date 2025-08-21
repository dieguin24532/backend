import QRCode from "qrcode";

const generarCodigoQR = async (texto) => {
    return await QRCode.toDataURL(texto);
}

export { generarCodigoQR }