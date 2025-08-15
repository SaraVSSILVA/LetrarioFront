import axios from 'axios'

const API_URL = 'https://letrario-api.onrender.com'

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    username,
    password,
  })
  return {
    token: response.data.access_token,
    usuarioId: response.data.usuarioId
  }
}