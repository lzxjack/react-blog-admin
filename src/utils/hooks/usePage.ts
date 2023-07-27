import useUrlState from '@ahooksjs/use-url-state';
import { useMemoizedFn, useMount } from 'ahooks';
import { useSearchParams } from 'react-router-dom';

export const usePage = () => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useUrlState();

  useMount(() => {
    const page = searchParams.get('page');
    !page && setState({ page: 1 });
  });

  const setPage = useMemoizedFn((page: number) => {
    setState({ page });
  });

  return {
    page: Number(state.page || 1),
    setPage
  };
};
