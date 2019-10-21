// Testando a conexão
import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import Student from '../app/models/Student';

const models = [Student];

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
  }

  init() {
    this.connection = conectarDB;

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
