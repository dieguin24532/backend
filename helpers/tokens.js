import jwt from 'jsonwebtoken';

const crearToken = (usuario, rol) => {
    return jwt.sign({usuario, rol}, process.env.JWT_KEY, {expiresIn: "1h"});
}

export { crearToken }