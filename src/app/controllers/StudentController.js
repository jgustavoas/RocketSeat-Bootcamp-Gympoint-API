// Usa-se o formato abaixo porque esse pacote chamado Yup não possui "export default"
// O asterisco significa que vai ser importado tudo do pacote e colocado na variável
// O pacote Yup é usado para validação
import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    // Usando o Yup para validar
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup.number().required(),
      peso: Yup.number().required(),
      altura: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Todos os campos são obrigatórios!' });
    }
    // fim da validação

    const alunoExistePorEmail = await Student.findOne({
      where: { email: req.body.email },
    });

    if (alunoExistePorEmail) {
      return res
        .status(400)
        .json({ error: 'Outro aluno já existe com esse e-mail!' });
    }

    const { id, nome, email, idade, peso, altura } = await Student.create(
      req.body
    );

    return res.json({ id, nome, email, idade, peso, altura });
  }

  async update(req, res) {
    // Usando o Yup para validar
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      idade: Yup.number().required(),
      peso: Yup.number().required(),
      altura: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Todos os campos são obrigatórios!' });
    }
    // fim da validação

    const { email } = req.body;

    // Procurando um aluno com a id obtida na requisição
    // findByPk significa procurar pela Primary Key, neste caso a id do aluno
    const aluno = await Student.findByPk(req.params.id);

    if (email !== aluno.email) {
      const alunoExistePorEmail = await Student.findOne({
        where: { email },
      });

      if (alunoExistePorEmail) {
        return res
          .status(400)
          .json({ error: 'Outro aluno já existe com esse e-mail!' });
      }
    }

    const { id, name } = await aluno.update(req.body);

    return res.json({ id, name, email });
  }
}

export default new StudentController();
