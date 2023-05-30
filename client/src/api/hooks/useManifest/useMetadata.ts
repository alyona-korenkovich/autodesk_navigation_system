import { useCallback, useEffect, useState } from 'react';
import { APIFetch } from '../../utils/APIFetch/APIFetch';
import { E_HTTP_METHODS } from '../../../types';

type TViewable = {
  name: string;
  role: string;
  guid: string;
  isMasterView?: boolean;
};

const useMetadata = (url: string) => {
  const [needToUpdate, setNeedToUpdate] = useState(true);
  const [viewables, setViewables] = useState<TViewable[] | undefined>([]);

  const fetchViewables = useCallback(async () => {
    try {
      const data = await APIFetch(`/${url}`, E_HTTP_METHODS.GET, {}, {});

      if (data.metadata) {
        setNeedToUpdate(false);
        setViewables(data.metadata.body.data.metadata);
      } else {
        setNeedToUpdate(false);
      }
    } catch (e) {}
    //eslint-disable-next-line
  }, [viewables]);

  useEffect(() => {
    if (needToUpdate) {
      fetchViewables();
    }
    //eslint-disable-next-line
  }, [fetchViewables]);

  return viewables;
};

export default useMetadata;
