import { COMMON_HEADERS, ETypeBody, ROUTE } from '../../const';
import { E_HTTP_METHODS } from '../../../types';
import { getBody } from '../getBody';
import { getHttpError } from '../getHttpError/getHttpError';

export const APIFetch = async (
  url: string,
  method?: E_HTTP_METHODS,
  headersRequest?: any,
  options?: any,
  type?: string,
) => {
  const token = '';

  const requestOptions = {
    method: method || E_HTTP_METHODS.GET,
    ...options,
    ...getBody(method, type, options?.body),
  };

  const commonHeaders = type === ETypeBody.File ? '' : COMMON_HEADERS;

  try {
    const response = await fetch(`${ROUTE}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...commonHeaders,
        ...headersRequest,
      },
      ...requestOptions,
    });
    if (!response.ok) {
      throw await getHttpError(response);
    }
    return await response.json();
  } catch (e) {
    return Promise.reject(e);
  }
};
