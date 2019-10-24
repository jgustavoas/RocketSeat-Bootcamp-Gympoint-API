import Bee from 'bee-queue';
// Lógica similar ao models, cada job é importado e inserido na array nomeada de "job"
import HelpOrderReplyMail from '../app/jobs/HelpOrderReplyMail';

import redisConfig from '../config/redis';

const jobs = [HelpOrderReplyMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  /**
   * Lógica: inicia-se uma instância da classe "Queue"
   * Para cada (forEach) job da array jobs coloca-se seu item (key) no objeto "this.queues"
   * Cada uma dessas queues (this.queues[]) tem sua fila e se conecta com o db Redis
   * O método que vai realizar a tarefa é nomeado de "handle", que neste caso é o envio do e-mail   */
  init() {
    jobs.forEach(({ key, handle }) => {
      // Por que forEach e não map()? Porque não precisa retornar algo
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  /**
   * add(), adiciona na fila a key "HelpOrderReplyMail" como primeiro parâmetro
   * e também os dados da mensagem como segundo parâmetro
   */
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: A FILA FALHOU`, err);
  }
}

export default new Queue();
