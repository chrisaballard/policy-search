import { useSelector, useDispatch } from 'react-redux';
import { loadPolicy, loadPolicies } from '../actions';
import { State } from '../store/initialState'

const useGetPolicies = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: State ) => state)
  const { policies, policy } = state;

  const getPolicy = (id:  string | string[]): void => {
    dispatch(loadPolicy(id))
  }

  const getPolicies = () => {
    dispatch(loadPolicies());
  }
  
  return [policy, policies, getPolicy, getPolicies] as const;
}
export default useGetPolicies;