import jwt from 'jsonwebtoken';

/**
 * Genera un token utilizando JWT
 */
const crearToken = (usuario, rol) => {
    return jwt.sign({usuario, rol}, process.env.JWT_KEY, {expiresIn: "1h"});
}

export { crearToken }