import axios from 'axios';

export const buyCorn = async (clientCode: string) => {
  const response = await axios.post('http://localhost:3001/api/corn/buy', {}, {
    headers: { 'x-client-id': clientCode }
  });
  return response.data;
};
