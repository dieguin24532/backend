import { ApiResponse } from "../dtos/ApiResponseDTO.js";
import { crearToken } from "../helpers/tokens.js";
import Usuario from "../models/db/Usuarios.js";
import bcrypt from "bcrypt";

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
            return res
                .cookie("token", token, {
                    httpOnly: true,
                    //Cambiar en produccion
                    secure: process.env.SECURE,
                    samesite: "strict",
                    maxAge: 1000 * 60 * 60,
                })
                .status(200)
                .json(ApiResponse.getResponse(200, "Autenticado correctamente", token));
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
        res.status(200).json(ApiResponse.getResponse( 200, "Logout exitoso", null));
    } catch (error) {
        console.log(error);
        res.status(500).json(ApiResponse.getResponse(500, "Error interno del servidor", null));
    }
};

export { login, logout };
