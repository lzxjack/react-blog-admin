// import { useMount } from 'ahooks';
// import { useSearchParams } from 'react-router-dom';

// export const usePage = () => {
//   const [searchParams, setSearchParams] = useSearchParams();

//   useMount(() => {
//     const page = searchParams.get('page');
//     setSearchParams(`page=${page || 1}`);
//   });

//   const setPage = (page: number) => {
//     setSearchParams(`page=${page}`);
//   };

//   return { page: Number(searchParams.get('page') || 1), setPage };
// };

import useUrlState from '@ahooksjs/use-url-state';
import { useMount } from 'ahooks';

export const usePage = () => {
  const [state, setState] = useUrlState({ page: 1 });

  useMount(() => {
    setState({ page: 1 });
  });

  const setPage = (page: number) => {
    setState({ page });
  };

  return {
    page: Number(state.page || 1),
    setPage
  };
};
