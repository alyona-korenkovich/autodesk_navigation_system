import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { COMMON_HEADERS, ROUTE } from '../../const';
import { E_HTTP_METHODS } from '../../../types';
import { getToken } from '../../../store/selector';

const useFetch = (
  url: string,
  method?: E_HTTP_METHODS,
  headersRequest?: HeadersInit,
  options?: Object,
) => {
  const token = useSelector(getToken);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!url) return;

      const requestOptions = {
        method: method || E_HTTP_METHODS.GET,
        ...options,
      };

      try {
        setLoading(true);
        const response = await fetch(`${ROUTE}${url}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            ...COMMON_HEADERS,
            ...headersRequest,
          },
          ...requestOptions,
        });
        if (response.ok) {
          const dataInput = await response.json();
          setData(dataInput);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
        setErrors(e);
      }
    };

    fetchData();
    //eslint-disable-next-line
  }, []);

  return { data, loading, errors };
};

export default useFetch;
