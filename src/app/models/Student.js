import Sequelize, { Model } from 'sequelize';

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        idade: Sequelize.INTEGER,
        peso: Sequelize.DECIMAL(10, 2),
        altura: Sequelize.DECIMAL(10, 2),
      },
      { sequelize, modelName: 'students' }
    );

    return this;
  }
}

export default Student;
