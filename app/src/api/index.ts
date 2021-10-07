import axios from 'axios';
import { Policies } from '../model/policies';
import { PER_PAGE, API_BASE_URL } from '../constants';

const fetchData = async (req: string): Promise<any> => {
  return await axios.get(req)
    .then( response => {
      return response.statusText =='OK'
        ? response.data
        : Promise.reject(Error('Unsuccessful response'));
    })
}

export const getPolicies = async (start?: number): Promise<Policies> => {
  let req = `${API_BASE_URL}/policies?limit=${PER_PAGE}`;
  if(start) {
    req += `&start=${start}`
  }
  return await fetchData(req);
}

export const searchQuery = async (queryString: string) => {
  // query=[keywords]&geography=geocode1&geography=geocode2
  let req = `${API_BASE_URL}/policies/search?${queryString}&limit=${PER_PAGE}`;
  return await fetchData(req);
}

export const loadGeographies = async () => {
  return await fetchData(`${API_BASE_URL}/geographies`)
}