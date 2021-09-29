import axios from 'axios';

export async function getPolicies() {
  const response = await axios.get('http://localhost:8001/policies/?limit=10')
  // .then((response) => {
  //   console.log(response.data)

  // })
  const data = await response.data;
  return data;

}