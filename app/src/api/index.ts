import axios from 'axios';
import { Policy } from '../model/policy';

const baseUrl = 'http://localhost:8001';

export const getPolicies = async (): Promise<Policy[]> => {
  const response = await axios.get(`${baseUrl}/policies`);
  console.log(response.data)
  const data = await response.data.policies;
  return data;

}