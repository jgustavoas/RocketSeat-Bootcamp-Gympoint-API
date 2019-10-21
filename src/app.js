import express, { json } from 'express';
// import './database';

import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(json());
  }

  // rotas também funcionam como middlewares e por isso podem ser chamadas dentro de "this.server.use"
  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
