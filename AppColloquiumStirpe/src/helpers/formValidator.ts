import Yup from './Yup';

export type FormConfig<T extends object> = {
  initialValues: T;
  validationShape: Yup.ObjectSchemaDefinition<T>;
};

const formValidator = <T extends object>({
  validationShape,
  initialValues,
}: FormConfig<T>) => ({
  initialValues,
  validationSchema: Yup.object().shape(validationShape),
});
export default formValidator;
