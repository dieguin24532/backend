import Usuario from "../models/db/Usuarios.js";

/**
 * Servicio de Usuarios
 * Encapsula la lógica de acceso a la BD
 */
export class UsuariosService {
  /**
   * Busca o crea un usuario
   * @param {string} email - Email del usuario
   * @param {object} datosUsuario - Datos del usuario (nombre, password, rol, etc)
   * @returns {Promise<[Usuario, boolean]>} Retorna [usuario, esNuevo]
   */
  static async buscarOCrearUsuario(email, datosUsuario) {
    try {
      const [usuario, esNuevo] = await Usuario.findOrCreate({
        where: { email },
        defaults: datosUsuario
      });
      return [usuario, esNuevo];
    } catch (error) {
      throw { statusCode: 500, message: "Error al crear usuario: " + error.message };
    }
  }

  /**
   * Obtiene todos los usuarios
   * @returns {Promise<Usuario[]>} Array de usuarios
   */
  static async obtenerTodos() {
    try {
      const usuarios = await Usuario.findAll();
      return usuarios;
    } catch (error) {
      throw { statusCode: 500, message: "Error al obtener usuarios: " + error.message };
    }
  }

  /**
   * Obtiene un usuario por email
   * @param {string} email - Email del usuario
   * @returns {Promise<Usuario|null>} Usuario encontrado o null
   */
  static async obtenerPorEmail(email) {
    try {
      const usuario = await Usuario.findOne({
        where: { email }
      });
      return usuario;
    } catch (error) {
      throw { statusCode: 500, message: "Error al obtener usuario: " + error.message };
    }
  }

  /**
   * Obtiene un usuario por ID
   * @param {string|number} id - ID del usuario
   * @returns {Promise<Usuario|null>} Usuario encontrado o null
   */
  static async obtenerPorId(id) {
    try {
      const usuario = await Usuario.findByPk(id);
      return usuario;
    } catch (error) {
      throw { statusCode: 500, message: "Error al obtener usuario: " + error.message };
    }
  }

  /**
   * Actualiza un usuario
   * @param {string} email - Email del usuario a actualizar
   * @param {object} datosActualizados - Datos a actualizar
   * @returns {Promise<Usuario>} Usuario actualizado
   */
  static async actualizar(email, datosActualizados) {
    try {
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        throw { statusCode: 404, message: "Usuario no encontrado" };
      }
      await usuario.update(datosActualizados);
      return usuario;
    } catch (error) {
      throw error.statusCode ? error : { statusCode: 500, message: "Error al actualizar usuario: " + error.message };
    }
  }

  /**
   * Elimina un usuario
   * @param {string} email - Email del usuario a eliminar
   * @returns {Promise<number>} Número de registros eliminados
   */
  static async eliminar(email) {
    try {
      const resultado = await Usuario.destroy({
        where: { email }
      });
      if (resultado === 0) {
        throw { statusCode: 404, message: "Usuario no encontrado" };
      }
      return resultado;
    } catch (error) {
      throw error.statusCode ? error : { statusCode: 500, message: "Error al eliminar usuario: " + error.message };
    }
  }

  /**
   * Verifica si un email ya está registrado
   * @param {string} email - Email a verificar
   * @returns {Promise<boolean>} true si existe, false si no
   */
  static async emailExiste(email) {
    try {
      const usuario = await Usuario.findOne({ where: { email } });
      return !!usuario;
    } catch (error) {
      throw { statusCode: 500, message: "Error al verificar email: " + error.message };
    }
  }
}
