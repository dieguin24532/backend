/**
 * Añade la columna `imagen` (STRING, NULLABLE) a la tabla `eventos`.
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('eventos', 'imagen', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('eventos', 'imagen');
  }
};
