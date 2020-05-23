'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Commentsancestors', {
      CommentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Comments',
          key: 'id'
        },
        onDelete: 'cascade'
      },
      ancestorId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Comments',
          key: 'id'
        },
        onDelete: 'cascade'
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Commentsancestors');
  }
};