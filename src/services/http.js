import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': "*"
  }
})

// const fakeAxios = {
  
// }

export default axiosInstance