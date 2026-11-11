import api from './api';

export const authService = {
  login: (dados) => api.post('/auth/login', dados),
  cadastrar: (dados) => api.post('/auth/cadastro', dados),
};
