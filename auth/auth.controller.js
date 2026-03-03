import { ApiResponseHelper } from "../helpers/api.response.js";
import { AuthService } from "./auth.service.js";
import { check, validationResult } from "express-validator";
import { mapearErrores } from "../helpers/errores.js";

// Extrae token desde cookie, header Authorization Bearer o body.token
const getTokenFromReq = (req) => {
  if (req.cookies?.token) return req.cookies.token;
  const auth = req.headers.authorization || req.headers.Authorization;
  if (auth?.toString().startsWith("Bearer ")) return auth.toString().slice(7);
  if (req.body?.token) return req.body.token;
  return null;
};

/**
 * Autentica al usuario mediante email y contraseña.
 */
// Detecta cliente móvil
const isMobileClient = (req) => {
  return ((req.headers?.["x-client"] || "").toString().toLowerCase() === "mobile") ||
         (req.body?.client || "").toString().toLowerCase() === "mobile";
};

/**
 * Autentica al usuario mediante email y contraseña.
 */
const login = async (req, res) => {
  try {
    await check("email")
      .notEmpty()
      .withMessage("El email es obligatorio")
      .isEmail()
      .withMessage("Debe ser mail válido")
      .run(req);

    await check("password")
      .notEmpty()
      .withMessage("La contraseña es obligatoria")
      .run(req);

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      const erroresMapedos = mapearErrores(errores);
      return res.status(422).json(ApiResponseHelper.getResponse(422, "Campos inválidos", erroresMapedos));
    }

    const { email, password } = req.body;
    const resultado = await AuthService.autenticar(email, password);

    // Cliente móvil: devuelve token en JSON
    if (isMobileClient(req)) {
      return res.status(200).json(ApiResponseHelper.getResponse(200, "Autenticado correctamente", resultado));
    }

    // Web: cookie segura
    return res
      .cookie("token", resultado.token, {
        httpOnly: true,
        secure: process.env.SECURE === "true",
        sameSite: "Strict",
        maxAge: 1000 * 60 * 60,
      })
      .status(200)
      .json(ApiResponseHelper.getResponse(200, "Autenticado correctamente", { nombre: resultado.nombre, rol: resultado.rol }));

  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Error interno del servidor";
    console.error("Error en login:", error);
      return res.status(statusCode).json(ApiResponseHelper.getResponse(statusCode, message, null));
  }
};


/**
 * Cierra la sesión del usuario.
 */
const logout = async (req, res) => {
  try {
    // Web: limpiar cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.SECURE === "true",
      sameSite: "Strict",
    });

    res.status(200).json(ApiResponseHelper.getResponse(200, "Logout exitoso", null));
  } catch (error) {
    console.error("Error en logout:", error);
    return res.status(500).json(ApiResponseHelper.getResponse(500, "Error interno del servidor", null));
  }
};


/**
 * Verifica si el token JWT es válido.
 */
const isAuth = async (req, res) => {
  try {
    const token = getTokenFromReq(req);
    const usuario = await AuthService.verificarToken(token);

    return res.status(200).json(ApiResponseHelper.getResponse(200, "Token válido", true));
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error("Error en isAuth:", error);
    return res.status(statusCode).json(ApiResponseHelper.getResponse(statusCode, error.message, false));
  }
};


/**
 * Devuelve el rol del usuario autenticado.
 */
const getRoleLoginUser = async (req, res) => {
  try {
    const token = getTokenFromReq(req);
    const rol = await AuthService.obtenerRolDelToken(token);

    return res.status(200).json(ApiResponseHelper.getResponse(200, "Rol obtenido", rol));
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error("Error en getRoleLoginUser:", error);
    return res.status(statusCode).json(ApiResponseHelper.getResponse(statusCode, error.message, false));
  }
};

export { login, logout, isAuth, getRoleLoginUser };
