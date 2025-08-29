import { ApiResponse } from "../dtos/ApiResponseDTO.js";
import { crearToken } from "../helpers/tokens.js";
import Usuario from "../models/db/Usuarios.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res
        .status(400)
        .json(
          ApiResponse.getResponse(
            400,
            "Usuario y contraseña son requeridas",
            null
          )
        );
    }

    const usuario = await Usuario.findOne({
      where: {
        email: email,
      },
    });

    if (!usuario) {
      return res
        .status(401)
        .json(ApiResponse.getResponse(401, "Autenticación fallida", null));
    }

    const matchPassword = await bcrypt.compare(password, usuario.password);

    if (email === usuario.email && matchPassword) {
      const token = crearToken(email);
      const usuario = await Usuario.findOne({ where: { email: email } })
      return res
        .cookie("token", token, {
          httpOnly: true,
          //Cambiar en produccion
          secure: process.env.SECURE,
          samesite: "lax",
          maxAge: 1000 * 60 * 60,
        })
        .status(200)
        .json(ApiResponse.getResponse(200, "Autenticado correctamente", {nombre:usuario.nombre}));
    } else {
      res
        .status(401)
        .json(ApiResponse.getResponse(401, "Autenticación fallida", null));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(ApiResponse.getResponse(500, "Error interno del servidor", null));
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, secure: process.env.SECURE });
    res.status(200).json(ApiResponse.getResponse(200, "Logout exitoso", null));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(ApiResponse.getResponse(500, "Error interno del servidor", null));
  }
};

const isAuth = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json(ApiResponse.getResponse(401, "Token no existe", false));
    }

    const payload = jwt.verify(token, process.env.JWT_KEY);
    req.usuario = payload.usuario;
    const usuarioEncontrado = await Usuario.findOne({
      where: { email: req.usuario },
    });

    if (!usuarioEncontrado) {
      return res
        .status(403)
        .json(ApiResponse.getResponse(403, "Token inválido", false));
    }

    res.status(200).json(ApiResponse.getResponse(200, "Token válido", true));
  } catch (error) {
    console.log(error);
    res.status(500).json(ApiResponse.getResponse(500, "Token inválido", false));
  }
};

export { login, logout, isAuth };
