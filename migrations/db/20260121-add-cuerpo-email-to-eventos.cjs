/**
 * Añade la columna `cuerpo_email` (STRING, NULLABLE) a la tabla `eventos`.
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('eventos', 'cuerpo_email', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('eventos', 'cuerpo_email');
  }
};
