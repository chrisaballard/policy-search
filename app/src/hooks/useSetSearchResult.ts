import { useSelector, useDispatch } from 'react-redux';
import { getSearchResult, clearSearchResult } from '../actions';
import { State } from '../store/initialState'

const useGetSearchResult = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: State ) => state)
  const { searchResult } = state;

  const getResult = (queryString: string): void => {
    dispatch(getSearchResult(queryString))
  }
  const clearResult = (): void => {
    dispatch(clearSearchResult())
  }
  return [searchResult, getResult, clearResult] as const;
}
export default useGetSearchResult;