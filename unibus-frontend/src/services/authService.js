import api from './api.js';

export const authService = {
  login: (dados) => api.post('/auth/login', dados),
  cadastrar: (dados) => api.post('/auth/cadastro', dados),
  logout: () => {
    localStorage.removeItem('unibus-token');
    localStorage.removeItem('unibus-user');
  },
  getUsuario: () => {
    try {
      const usuario = localStorage.getItem('unibus-user');
      const token = localStorage.getItem('unibus-token');
      if (!token || !usuario) return null;
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        authService.logout();
        return null;
      }
      return JSON.parse(usuario);
    } catch {
      return null;
    }
  },
};
