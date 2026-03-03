"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tickets', 'escaneado', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });

    await queryInterface.addColumn('tickets', 'fecha_escaneo', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tickets', 'escaneado');
    await queryInterface.removeColumn('tickets', 'fecha_escaneo');
  }
};
