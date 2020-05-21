'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Commentsancestors', {
      CommentId: {
        type: Sequelize.INTEGER
      },
      ancestorId: {
        type: Sequelize.INTEGER
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Commentsancestors');
  }
};