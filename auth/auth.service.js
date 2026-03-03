import Usuario from "../models/db/Usuarios.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { crearToken } from "./helpers/tokens.js";

/**
 * Servicio de autenticación
 */
export class AuthService {
  /**
   * Autentica un usuario con email y contraseña
   */
  static async autenticar(email, password) {
    email = (email || "").trim().toLowerCase();
    password = password || "";

    if (!email || !password) {
      throw { statusCode: 400, message: "Email y contraseña requeridos" };
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      throw { statusCode: 401, message: "Credenciales inválidas" };
    }

    const matchPassword = await bcrypt.compare(password, usuario.password);
    if (!matchPassword) {
      throw { statusCode: 401, message: "Credenciales inválidas" };
    }

    const token = crearToken(email, usuario.rol);
    return { token, nombre: usuario.nombre, rol: usuario.rol, email };
  }

  /**
   * Verifica si un token es válido
   */
  static async verificarToken(token) {
    if (!token) {
      throw { statusCode: 401, message: "Token no proporcionado" };
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
      throw { statusCode: 403, message: "Token expirado o inválido" };
    }

    const usuario = await Usuario.findOne({ where: { email: payload.usuario } });
    if (!usuario) {
      throw { statusCode: 403, message: "Token inválido: Usuario no encontrado" };
    }

    return { email: payload.usuario, rol: usuario.rol };
  }

  /**
   * Obtiene el rol del usuario desde el token
   */
  static async obtenerRolDelToken(token) {
    const usuario = await this.verificarToken(token);
    return usuario.rol;
  }
}