import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const buyCorn = async (clientCode: string) => {
  const response = await axios.post(`${apiUrl}/buy`, { clientCode });
  return response.data;
};
