import { Router } from 'express';

import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import PlanController from './app/controllers/PlanController';
import MatrciculationController from './app/controllers/MatriculationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/', (req, res) => {
  res.send('Hello Gympoint');
});

/**
 * Checkins e pedidos de ajuda são inseridos logo aqui em cima porque são feitos por alunos
 * e não requer middleware de autenticação
 *  */
routes.get('/students/:id/checkins', CheckinController.index);
routes.post('/students/:id/checkins', CheckinController.store);
routes.post('/students/:id/help-orders', HelpOrderController.store);

routes.post('/sessions', SessionController.store);

// Como middleare global, coloca-se o middleware criado dentro de routes.use()
// Esse middleware "global" só vai funcionar para as rotas nas linhas abaixo dele
routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.get('/students', StudentController.index);
// routes.get('/students/:id', StudentController.index);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.get('/matriculations', MatrciculationController.index);
routes.post('/matriculations', MatrciculationController.store);
routes.put('/matriculations/:id', MatrciculationController.update);
routes.delete('/matriculations/:id', MatrciculationController.delete);

// Apenas usuários da academia logados podem acessar pedidos de ajuda
routes.get('/students/:id/help-orders', HelpOrderController.index);
routes.get('/students/help-orders', HelpOrderController.read);
routes.post('/help-orders/:id/answer', HelpOrderController.reply);

export default routes;
