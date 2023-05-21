import { useMount } from 'ahooks';
import { useSearchParams } from 'react-router-dom';

export const useUpdateData = (run: Function) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleDeleteParam = (param: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(param);
    setSearchParams(params.toString());
  };

  useMount(() => {
    const updated = searchParams.get('updated');
    if (updated === '1') {
      run();
      handleDeleteParam('updated');
    }
  });
};
