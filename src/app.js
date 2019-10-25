import express, { json } from 'express';
import Youch from 'youch'; // Pretty error reporting for Node.js
import * as Sentry from '@sentry/node';
import 'express-async-errors'; // Necessário que seja importado antes de "routes"
import routes from './routes';

import sentryConfig from './config/sentry';

import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(json());
  }

  // rotas também funcionam como middlewares e por isso podem ser chamadas dentro de "this.server.use"
  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    // Esté é um middleware assíncrono para tratamento de exceção
    // Observe quatro parâmetros ao invés de três
    // O primeiro parâmetro é o erro e este vem primeiro para que seja capturado
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();

      return res.status(500).json(errors);
    });
  }
}

export default new App().server;
