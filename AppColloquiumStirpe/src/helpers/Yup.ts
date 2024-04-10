import * as Yup from 'yup';

Yup.setLocale({
  mixed: {
    default: '${path} é inválido',
    // required: '${path} é um campo obrigatório',
    required: 'Campo obrigatório',
    oneOf: '${path} deve ser um dos seguintes valores: ${values}',
    notOneOf: '${path} não pode ser um dos seguintes valores: ${values}',
  },
  string: {
    length: '${path} deve ter exatamente ${length} caracteres',
    min: '${path} deve ter pelo menos ${min} caracteres',
    max: '${path} deve ter no máximo ${max} caracteres',
    email: '${path} tem o formato de e-mail inválido',
    url: '${path} deve ter um formato de URL válida',
    trim: '${path} não deve conter espaços no início ou no fim.',
    lowercase: '${path} deve estar em maiúsculo',
    uppercase: '${path} deve estar em minúsculo',
  },
  number: {
    min: '${path} deve ser no mínimo ${min}',
    max: '${path} deve ser no máximo ${max}',
    lessThan: '${path} deve ser menor que ${less}',
    moreThan: '${path} deve ser maior que ${more}',
    positive: '${path} deve ser um número posítivo',
    negative: '${path} deve ser um número negativo',
    integer: '${path} deve ser um número inteiro',
  },
  date: {
    min: '${path} deve ser maior que a data ${min}',
    max: '${path} deve ser menor que a data ${max}',
  },
  array: {
    min: '${path} deve ter no mínimo ${min} itens',
    max: '${path} deve ter no máximo ${max} itens',
  },
});

// auto complete doesn`t work well with this lib
// Im re exporting it because of that
// Sue me, Pedro Raft
export default Yup;
