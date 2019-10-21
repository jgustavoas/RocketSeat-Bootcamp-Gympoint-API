import { Router } from 'express';

import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/', (req, res) => {
  res.send('Hello Gympoint');
});

routes.post('/sessions', SessionController.store);

// Como middleare global, coloca-se o middleware criado dentro de routes.use()
// Esse middleware "global" só vai funcionar para as rotas nas linhas abaixo dele
routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

export default routes;
