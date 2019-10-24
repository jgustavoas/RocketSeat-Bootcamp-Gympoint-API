import { eachDayOfInterval } from 'date-fns';

import Checkin from '../models/Checkin';
import Matriculation from '../models/Matriculation';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { id } = req.params;

    const alunoExiste = await Student.findOne({
      where: { id },
    });
    if (!alunoExiste) {
      return res.status(400).json({
        erro: `Aluno não identificado!`,
      });
    }

    const alunoMatriculado = await Matriculation.findOne({
      where: { student_id: id },
    });

    if (!alunoMatriculado) {
      return res.status(401).json({
        forbidden: `Aluno não matriculado!`,
      });
    }

    const checkins = await Checkin.findAll({
      where: { student_id: id },
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const { id } = req.params;

    const alunoExiste = await Student.findOne({
      where: { id },
    });
    if (!alunoExiste) {
      return res.status(400).json({
        erro: `Aluno não identificado!`,
      });
    }

    const alunoMatriculado = await Matriculation.findOne({
      where: { student_id: id },
    });

    if (!alunoMatriculado) {
      return res.status(401).json({
        forbidden: `Checkin não permitido para aluno não matriculado!`,
      });
    }

    const checkins = await Checkin.findAll({
      where: { student_id: id },
    });

    if (checkins.length > 0) {
      const ordenarDatas = checkins.sort(function(a, b) {
        return a.id - b.id;
      });

      const primeiroCheckin = ordenarDatas[0].createdAt;

      const intervalo = eachDayOfInterval({
        start: primeiroCheckin,
        end: new Date(),
      });

      const quantosCheckins = checkins.length;
      const quantosDias = intervalo.length;

      const flexaoNumSubstantivo = quantosDias > 1 ? 's' : '';

      if (quantosCheckins >= 5 && quantosDias <= 7) {
        return res.status(401).json({
          impedido: `Você já fez ${quantosCheckins} checkins em ${quantosDias} dia${flexaoNumSubstantivo}!`,
        });
      }

      await Checkin.create({ student_id: id });

      return res.json({
        benvindo: `Este é o seu ${quantosCheckins +
          1}º checkin em ${quantosDias} dia${flexaoNumSubstantivo}!`,
      });
    }

    await Checkin.create({ student_id: id });

    return res.json(
      `Checkin realizado com sucesso! Este é o seu primeiro checkin.`
    );
  }
}

export default new CheckinController();
