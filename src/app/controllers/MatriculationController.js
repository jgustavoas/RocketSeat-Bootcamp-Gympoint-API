import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';

import Plan from '../models/Plan';
import Matriculation from '../models/Matriculation';

class MatriculationController {
  async index(req, res) {
    // Testando variáveis com acentuação
    const matrículas = await Matriculation.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
    });
    return res.json({ matrículas });
  }

  async store(req, res) {
    // Usando o Yup para validar
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Todos os campos são obrigatórios!' });
    }
    // fim da validação

    const { student_id, start_date, plan_id } = req.body;

    const qualPlano = await Plan.findOne({
      where: { id: plan_id },
    });

    if (!qualPlano) {
      return res.status(400).json({ erro: 'Plano não localizado!' });
    }

    const { duration, price } = qualPlano;

    const precoTotal = price * duration;

    const end_date = addMonths(parseISO(start_date), duration);

    const matriculaExiste = await Matriculation.findOne({
      where: { student_id },
    });

    if (matriculaExiste) {
      return res
        .status(400)
        .json({ error: `Esse aluno já está matriculado em um plano!` });
    }

    const inserirDados = {
      student_id,
      plan_id,
      start_date,
      end_date,
      price: precoTotal,
    };

    await Matriculation.create(inserirDados);

    return res.json({ inserirDados });
  }

  async update(req, res) {
    // Usando o Yup para validar
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Todos os campos são obrigatórios!' });
    }
    // fim da validação Yup

    const alunoMatriculado = await Matriculation.findOne({
      where: { student_id: req.params.id },
    });
    if (!alunoMatriculado) {
      return res
        .status(400)
        .json({ erro: 'Aluno não matriculado em um plano!' });
    }

    const matriculaDoAluno = alunoMatriculado.id;

    const { start_date, plan_id } = req.body;

    const qualPlano = await Plan.findOne({
      where: { id: plan_id },
    });

    if (!qualPlano) {
      return res.status(400).json({ erro: 'Plano não localizado!' });
    }

    const { duration, price } = qualPlano;

    const precoTotal = price * duration;

    const end_date = addMonths(parseISO(start_date), duration);

    const inserirDados = {
      student_id: req.params.id,
      plan_id,
      start_date,
      end_date,
      price: precoTotal,
    };

    await Matriculation.update(inserirDados, {
      where: { id: matriculaDoAluno },
    });

    return res.json({ inserirDados });
  }

  async delete(req, res) {
    const alunoMatriculado = await Matriculation.findOne({
      where: { student_id: req.params.id },
    });

    if (!alunoMatriculado) {
      return res.status(400).json({ erro: 'O aluno não está matriculado!' });
    }

    await Matriculation.destroy({
      where: {
        student_id: req.params.id,
      },
    });

    return res.json({
      sucesso: `O aluno foi desmatriculado com sucesso.`,
    });
  }
}

export default new MatriculationController();
