import Yup from '../helpers/Yup';

export default {
  codigo: Yup.string().min(1).required(),
  descricao: Yup.string().min(1).required(),
};
