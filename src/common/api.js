import axios from 'axios'

export const http = axios.create({ baseURL: 'api/v1' })

http.interceptors.response.use(
  res => res.data,
  err => {
    throw err
  }
)
