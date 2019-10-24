import mongoose from 'mongoose';

const HelpOrderSchema = new mongoose.Schema(
  {
    /**
     * Definindo os campos do schema ("tabela")
     * Observar que são usados os primitivos do JS para indicar o tipo dos campos
     * ao invés de TEXT, INTEGER etc natural dos db en SQL
     * */
    question: {
      type: String,
      required: true,
    },
    question_id: {
      type: Number,
      required: true,
    },
    student_id: {
      type: Number,
      required: true,
    },
    student: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true, // isso configura o db a incluir "createdAt" e "updatedAt"
  }
);

// Modela o schema ("tabela") batizando-a com o nome "HelpOrder"...
// ...usando a estrutura definida em "HelpOrderSchema":
export default mongoose.model('HelpOrder', HelpOrderSchema);
