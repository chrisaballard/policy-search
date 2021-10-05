import axios from 'axios';
import { Policies } from '../model/policies';
import { PER_PAGE } from '../constants';

const baseUrl = 'http://localhost:8001';

export const getPolicies = async (start?: number): Promise<Policies> => {
  let req = `${baseUrl}/policies?limit=${PER_PAGE}`;
  if(start) {
    req += `&start=${start}`
  }
  return await axios.get(req)
    .then( response => {
      return response.statusText =='OK'
        ? response.data
        : Promise.reject(Error('Unsuccessful response'));
    })

}

export const searchQuery = async (query: string, start?: number) => {
  let req = `${baseUrl}/policies/search?query=${query}&limit=${PER_PAGE}`;
  if(start) {
    req += `&start=${start}`
  }
  return await axios.get(req)
    .then( response => {
      return response.statusText =='OK'
        ? response.data
        : Promise.reject(Error('Unsuccessful response'));
    })
}

export const loadGeographies = async () => {
  return await axios.get(`${baseUrl}/geographies`)
    .then( response => {
      return response.statusText =='OK'
        ? response.data
        : Promise.reject(Error('Unsuccessful response'));
    })
}