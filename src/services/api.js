import axios from 'axios';

// Em desenvolvimento, use o IP da sua máquina local
// Em produção, use a URL do Render
const API_URL = 'https://livros-api.onrender.com/api';

// Para desenvolvimento local, descomente a linha abaixo e use o IP da sua máquina:
// const API_URL = 'http://192.168.X.X:3000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para log de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Erro na API:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Sem resposta do servidor:', error.message);
    } else {
      console.error('Erro na requisição:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
