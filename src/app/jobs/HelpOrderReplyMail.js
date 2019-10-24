import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class HelpOrderReplyMail {
  // Usando o recurso get é possível o usuário acessar uma determinada propriedade
  // sem precisar identificá-la exatamente, neste caso chamando apenas CancellationMail.key
  // Isso é útil para retornar variáveis de fácil acesso sem precisar criar um constructor
  get key() {
    // Chave única para cada job
    return 'HelpOrderReplyMail';
  }

  // Criando um método para ser exucutado quando o job for designado
  async handle({ data }) {
    const { pedidoDeAjuda, answer } = data;

    console.log('A fila executou');

    // Enviar email após cancelamento
    await Mail.sendMail({
      to: `${pedidoDeAjuda.student} <${pedidoDeAjuda.email}>`,
      subject: `Resposta da sua dúvida #${pedidoDeAjuda.question_id}`,
      template: 'replyHelpOrder',
      context: {
        student: pedidoDeAjuda.student,
        question: pedidoDeAjuda.question,
        answer,
        date: format(
          parseISO(pedidoDeAjuda.createdAt),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new HelpOrderReplyMail();
