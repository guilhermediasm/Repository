import Yup from '../helpers/Yup';

export default {
  codigoBarra: Yup.string().min(12).max(12).required(),
  codigoBarraArezzo: Yup.string().max(20).notRequired(),
  corProdutoCodigo: Yup.number().min(1).required(),
  descricao: Yup.string().required().required(),
  referencia: Yup.number().min(1).required(),
  valor: Yup.number().min(1).required(),
};
