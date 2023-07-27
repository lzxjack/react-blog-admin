import useUrlState from '@ahooksjs/use-url-state';
import { useMemoizedFn } from 'ahooks';

export const useMyParams = () => {
  const [state, setState] = useUrlState<{
    searchTitle: any;
    searchClass: any;
    searchTag: string[];
  }>({
    searchTitle: undefined,
    searchClass: undefined,
    searchTag: []
  });

  const setSearchTitle = useMemoizedFn((title: string) => {
    setState({
      searchTitle: title
    });
  });

  const setSearchClass = useMemoizedFn((classText: string) => {
    setState({
      searchClass: classText
    });
  });

  const setSearchTag = useMemoizedFn((tag: string[]) => {
    setState({
      searchTag: tag
    });
  });

  const clearSearch = useMemoizedFn(() => {
    setState({
      searchTitle: undefined,
      searchClass: undefined,
      searchTag: []
    });
  });

  return {
    searchTitle: state.searchTitle,
    searchClass: state.searchClass,
    searchTag: Array.isArray(state.searchTag) ? state.searchTag : [state.searchTag],
    setSearchTitle,
    setSearchClass,
    setSearchTag,
    clearSearch
  };
};
