import { useCallback, useEffect, useState } from 'react';
import { APIFetch } from '../../utils/APIFetch/APIFetch';
import { E_HTTP_METHODS } from '../../../types';

const useManifest = (url: string) => {
  const [needToUpdate, setNeedToUpdate] = useState(true);
  const [result, setResult] = useState({
    progress: '0%',
    status: 'not started',
    error: null,
  });

  const fetchManifest = useCallback(async () => {
    try {
      const data = await APIFetch(`/${url}`, E_HTTP_METHODS.GET, {}, {});

      if (data.manifest) {
        const status = data.manifest.body.status;
        const progress = data.manifest.body.progress;

        if (status === 'success') {
          setNeedToUpdate(false);
        }

        setResult((prevState) => ({ ...prevState, progress, status }));
      } else {
        setNeedToUpdate(false);
        setResult((prevState) => ({ ...prevState, error: `${data.code}: ${data.message}` }));
      }
    } catch (e) {}
    //eslint-disable-next-line
  }, [result]);

  useEffect(() => {
    if (needToUpdate) {
      fetchManifest();
    }
    //eslint-disable-next-line
  }, [fetchManifest]);

  return { result };
};

export default useManifest;
