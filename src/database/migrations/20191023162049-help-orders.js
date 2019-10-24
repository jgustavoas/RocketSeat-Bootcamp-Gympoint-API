module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('help_orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      student_id: {
        type: Sequelize.INTEGER,
        // Indicando o relacionamento com a tabela "students"
        references: { model: 'students', key: 'id' },
        // Nas duas linhas abaixo se o arquivo for alterado, essa alteração se refletirá na tabela 'users'
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      question: {
        type: Sequelize.TEXT,
      },
      answer: {
        type: Sequelize.TEXT,
      },
      answer_at: {
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('help_orders');
  },
};
