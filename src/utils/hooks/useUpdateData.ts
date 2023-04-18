import { clearCache, useMount } from 'ahooks';
import { useSearchParams } from 'react-router-dom';

export const useUpdateData = (clear: string | Function, run: Function) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleDeleteParam = (param: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(param);
    setSearchParams(params.toString());
  };

  useMount(() => {
    const updated = searchParams.get('updated');
    if (updated === '1') {
      if (Object.prototype.toString.call(clear) === '[object String]') {
        clearCache(clear as string);
      } else {
        (clear as Function)();
      }
      run();
      handleDeleteParam('updated');
    }
  });
};
