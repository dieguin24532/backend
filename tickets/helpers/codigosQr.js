import QRCode from "qrcode";

/**
 * Genera y devuleve el código QR, recibe como parámetro un string
 * @param {*} texto 
 * @returns 
 */
const generarCodigoQR = async (texto) => {
    return await QRCode.toDataURL(texto);
}

export { generarCodigoQR }