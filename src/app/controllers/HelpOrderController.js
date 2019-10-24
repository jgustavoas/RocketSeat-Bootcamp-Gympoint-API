import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';
import HelpOrderSchema from '../schemas/HelpOrder';

// import Mail from '../../lib/Mail'; usando dentro com a biblioteca Queue

import Queue from '../../lib/Queue';
import HelpOrderReplyMail from '../jobs/HelpOrderReplyMail';

class HelpOrderController {
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

    const pedidoDeAjuda = await HelpOrder.findAll({
      where: { student_id: id },
    });

    return res.json(pedidoDeAjuda);
  }

  async read(req, res) {
    // No mongoDB a parte de ordenação, os limites de exibição etc. dos resultados é feita...
    // ...com uma sequência de métodos encadeados ("chaining") por pontos.
    const pedidoDeAjuda = await HelpOrderSchema.find({
      read: false,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(pedidoDeAjuda);
  }

  async store(req, res) {
    const { id } = req.params;
    const { question } = req.body;

    const alunoExiste = await Student.findOne({
      where: { id },
    });
    if (!alunoExiste) {
      return res.status(400).json({
        erro: `Aluno não identificado!`,
      });
    }

    const { nome, email } = alunoExiste;

    await HelpOrder.create({ student_id: id, question });

    const estePedido = await HelpOrder.findOne({
      where: { student_id: id },
      order: [['id', 'DESC']],
      limit: 1,
    });

    const question_id = estePedido.id;

    /**
     * Guardar o pedido de ajuda no MongoDB
     */
    await HelpOrderSchema.create({
      // Note que não é convecionado no MongoDB não usar variáveis dinâmicas que mudariam o conteúdo da mensagem quando fosse alteradas
      question,
      question_id,
      student_id: id,
      student: nome,
      email,
    });

    return res.json(`Pedido de ajuda realizado com sucesso!`);
  }

  async reply(req, res) {
    // No mongoDB a parte de ordenação, os limites de exibição etc. dos resultados é feita...
    // ...com uma sequência de métodos encadeados ("chaining") por pontos.
    const pedidoDeAjuda = await HelpOrderSchema.findOne({
      read: false,
      _id: req.params.id,
    });

    const { question_id } = pedidoDeAjuda;

    const { answer } = req.body;

    // "const enviarResposta" substituido pelo "job" na Queue mais abaixo
    /* const enviarResposta = await Mail.sendMail({
      to: `${student} <${email}>`,
      subject: `Resposta da sua dúvida #${question_id}`,
      template: 'replyHelpOrder',
      context: {
        student,
        question,
        answer,
        date: format(createdAt, "'dia' dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
      },
    }); */

    const enviarResposta = await Queue.add(HelpOrderReplyMail.key, {
      pedidoDeAjuda,
      answer,
      pt,
    });

    if (enviarResposta) {
      const marcarComoLido = await HelpOrderSchema.findByIdAndUpdate(
        req.params.id,
        { read: true },
        { new: true }
      );

      await HelpOrder.update(
        { answer, answer_at: format(new Date(), "yyyy'-'mm'-'dd' 'hh:mm:ss") },
        {
          where: { id: question_id },
        }
      );

      return res.json(marcarComoLido);
    }
    return res.status(400).json({ erro: 'Reposta não enviada' });
  }
}

export default new HelpOrderController();
