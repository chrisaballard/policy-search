import { useSelector, useDispatch } from 'react-redux';
import { getPolicyPage, clearPolicyPage } from '../actions';
import { State } from '../store/initialState'

const useGetPolicyPage = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: State ) => state)
  const { policyPage } = state;

  const getPage = (id: number, page: number): void => {
    dispatch(getPolicyPage(id, page))
  }
  const clearPage = (): void => {
    dispatch(clearPolicyPage())
  }
  return [policyPage, getPage, clearPage] as const;
}
export default useGetPolicyPage;