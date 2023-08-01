import { useMount } from 'ahooks';
import { useSearchParams } from 'react-router-dom';

export const useUpdateData = (
  keyMaps: {
    key: string;
    run: Function;
  }[]
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleDeleteParam = (param: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(param);
    setSearchParams(params.toString());
  };

  useMount(() => {
    keyMaps.forEach(({ key, run }) => {
      const theKey = searchParams.get(key);
      if (theKey === '1') {
        run();
        handleDeleteParam(key);
      }
    });
  });
};
