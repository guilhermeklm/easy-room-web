import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': "*"
  }
})

export default axiosInstance