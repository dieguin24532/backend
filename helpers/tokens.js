import jwt from 'jsonwebtoken';

const crearToken = (usuario) => {
    return jwt.sign({usuario}, process.env.JWT_KEY, {expiresIn: "1h"});
}

export { crearToken }