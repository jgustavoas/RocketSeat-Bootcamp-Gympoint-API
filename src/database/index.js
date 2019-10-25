// Testando a conexão
import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import Student from '../app/models/Student';
import Plan from '../app/models/Plan';
import Matriculation from '../app/models/Matriculation';
import Checkin from '../app/models/Checkin';
import HelpOrder from '../app/models/HelpOrder';

const models = [User, Student, Plan, Matriculation, Checkin, HelpOrder];

const conectarDB = new Sequelize(databaseConfig);

conectarDB
  .authenticate()
  .then(() => {
    // eslint-disable-next-line no-console
    console.warn('Conectado ao banco de dados com sucesso.');
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.warn('Incapaz de conectar o banco de dados:', err);
  });

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  // Conexão com Sequelize
  init() {
    this.connection = conectarDB;

    models.map(model => model.init(this.connection));
  }

  // Conexão do MongoDB
  mongo() {
    this.mongoConnection = mongoose.connect(
      process.env.MONGO_URL,
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
      /**
       * O motivo de usar o terceiro parâmetro acima, não mecionado pelo Diego foi a mensagem abaixo:
       * (node:5005) DeprecationWarning: current Server Discovery and Monitoring engine is deprecated,
       * and will be removed in a future version. To use the new Server Discover and Monitoring engine,
       * pass option { useUnifiedTopology: true } to the MongoClient constructor.
       */
    );
  }
}

export default new Database();
