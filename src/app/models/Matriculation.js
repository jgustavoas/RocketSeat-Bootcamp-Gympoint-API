import Sequelize, { Model } from 'sequelize';

class Matriculation extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        plan_id: Sequelize.INTEGER,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.DECIMAL(10, 2),
      },
      { sequelize, modelName: 'matriculation' }
    );

    return this;
  }
}

export default Matriculation;
