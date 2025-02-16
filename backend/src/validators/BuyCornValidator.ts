import * as yup from 'yup';
import {validateSchema} from "./ValidateSchema";

class BuyCornValidator {
  /**
   * Valida los datos del buy.
   * @param data - Datos a validar.
   */
  public buyCornValidation(data: any) {
    const schema = yup.object().shape({
      clientCode: yup
        .string()
        .required('El campo código de usuario es requerido')
        .min(3, 'El código de usuario debe tener al menos 4 caracteres'),
    });
    validateSchema(schema, data);
  }
}

export default new BuyCornValidator();
