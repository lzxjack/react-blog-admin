import { useMount } from 'ahooks';
import { useSearchParams } from 'react-router-dom';

export const usePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useMount(() => {
    const page = searchParams.get('page');
    setSearchParams(`page=${page || 1}`);
  });

  const setPage = (page: number) => {
    setSearchParams(`page=${page}`);
  };

  return { page: Number(searchParams.get('page') || 1), setPage };
};
