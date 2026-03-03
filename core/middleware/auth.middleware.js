import { ApiResponseHelper } from "../../helpers/api.response.js";
import { AuthService } from "../../auth/auth.service.js";

/**
 * Detecta si es cliente móvil
 */
const isMobileClient = (req) => {
  return ((req.headers?.["x-client"] || "").toString().toLowerCase() === "mobile") ||
         (req.body?.client || "").toString().toLowerCase() === "mobile";
};

/**
 * Extrae token desde cookie, header Authorization Bearer o body.token
 */
const getTokenFromReq = (req) => {
  if (req.cookies?.token) return req.cookies.token;
  const auth = req.headers.authorization || req.headers.Authorization;
  if (auth?.toString().startsWith("Bearer ")) return auth.toString().slice(7);
  if (req.body?.token) return req.body.token;
  return null;
};

/**
 * Middleware de autenticación
 * Verifica el token (desde cookie en web, Bearer en móvil)
 * Adjunta el usuario al request
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // Detectar si es mobile ANTES de validar token
    req.isMobile = isMobileClient(req);

    const token = getTokenFromReq(req);
    const usuario = await AuthService.verificarToken(token);

    // Adjuntar usuario al request
    req.usuario = usuario;
    next();
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error("Error en authMiddleware:", error);
    return res.status(statusCode).json(ApiResponseHelper.getResponse(statusCode, error.message, false));
  }
};

/**
 * Middleware para requerir un rol específico
 * @param {string|number|array} rolesRequeridos - Rol o array de roles permitidos
 */
export const requireRole = (rolesRequeridos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json(ApiResponseHelper.getResponse(401, "Usuario no autenticado", false));
    }

    const rolesArray = Array.isArray(rolesRequeridos) ? rolesRequeridos : [rolesRequeridos];

    if (!rolesArray.includes(req.usuario.rol)) {
      return res.status(403).json(ApiResponseHelper.getResponse(403, "Permisos insuficientes", false));
    }

    next();
  };
};
