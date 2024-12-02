import axios from 'axios';

console.log(import.meta.env.VITE_EASY_ROOM_API_URL)

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_EASY_ROOM_API_URL,
  headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': "*"
  }
});

export default axiosInstance;