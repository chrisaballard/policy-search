import { useSelector, useDispatch } from 'react-redux';
import { loadPolicy } from '../actions';
import { State } from '../store/initialState'

const useGetPolicies = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: State ) => state)
  const { policy } = state;

  const getPolicy = (id:  string | string[]): void => {
    dispatch(loadPolicy(id))
  }
  
  return [policy, getPolicy] as const;
}
export default useGetPolicies;