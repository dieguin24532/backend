import { ApiResponse } from "../dtos/ApiResponseDTO.js";
import { usuarioPublicoDTO } from "../dtos/usuarioDTO.js";
import Usuario from "../models/db/Usuarios.js";

const guardarUsuario = async (req, res) => {

    try{
        console.log(req);
        //TODO: Validaciones
        console.log(req.body);
        const usuario = await Usuario.create(req.body);
        res.status(200).json(ApiResponse.getResponse(200, 'Usuario creado con éxito', usuario))

    } catch(error) {
        console.log(error);
        res.status(500).json(ApiResponse.getResponse(500, 'Error interno del servidor', null))
    }
    
    
};

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();

        if(usuarios.length === 0) {
            return res.status(200).json(ApiResponse.getResponse(200, 'No existen usuarios', null));
        }

        const usuariosFormateados = usuarios.map(usuario => usuarioPublicoDTO(usuario))
        res.status(200).json(ApiResponse.getResponse(200, 'Usuarios encontrados', usuariosFormateados));

    } catch (error) {
        res.status(500).json(ApiResponse.getResponse(500, 'Error interno del servidor', null))
    }
}

export { guardarUsuario, obtenerUsuarios }
