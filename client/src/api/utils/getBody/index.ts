import { ETypeBody } from '../../const';
import { E_HTTP_METHODS } from '../../../types';

type TGetBody = {
  body: Object;
};

export const getBody = (
  method: E_HTTP_METHODS,
  type: string,
  bodyObject: Object,
): TGetBody | null =>
  method === E_HTTP_METHODS.POST && type != ETypeBody.File
    ? { body: JSON.stringify(bodyObject) }
    : null;
