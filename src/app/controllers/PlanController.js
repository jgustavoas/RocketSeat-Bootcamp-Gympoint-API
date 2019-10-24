import * as Yup from 'yup';

import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const planos = await Plan.findAll();
    return res.json({ planos });
  }

  async store(req, res) {
    // Usando o Yup para validar
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Todos os campos são obrigatórios!' });
    }
    // fim da validação

    const nomeDoPlanoExiste = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (nomeDoPlanoExiste) {
      return res
        .status(400)
        .json({ error: `Já existe um plano chamado ${req.body.title}!` });
    }

    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({ id, title, duration, price });
  }

  async update(req, res) {
    // Usando o Yup para validar campos do formulário
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Todos os campos são obrigatórios!' });
    }
    // fim da validação de formulário

    const novoNome = req.body.title;

    const plano = await Plan.findByPk(req.params.id);

    if (!plano) {
      return res.status(400).json({ erro: 'Plano não existente!' });
    }

    if (novoNome !== plano.title) {
      const nomeDoPlanoExiste = await Plan.findOne({
        where: { title: novoNome },
      });

      if (nomeDoPlanoExiste) {
        return res
          .status(400)
          .json({ error: `Já existe um plano chamado ${novoNome}!` });
      }
    }

    const { id, title, duration, price } = await plano.update(req.body);

    return res.json({ id, title, duration, price });
  }

  async delete(req, res) {
    const plano = await Plan.findByPk(req.params.id);

    if (!plano) {
      return res.status(400).json({ erro: 'Plano não existente!' });
    }

    const { title } = plano;

    await Plan.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.json({ sucesso: `O plano ${title} foi deletado com sucesso!` });
  }
}

export default new PlanController();
