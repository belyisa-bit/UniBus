import api from './api.js';

export const unibusService = {
  // Linhas
  getLinhas: (options) => api.get('/linhas', options),
  getHorariosPorLinha: (id, options) => api.get(`/horarios/linha/${id}`, options),
  getParadasPorLinha: (id, options) => api.get(`/paradas/linha/${id}`, options),
  getLinhaPorId: (id) => api.get(`/linhas/${id}`),
  getLocalizacaoPorLinha: (id) => api.get(`/linhas/${id}/localizacao`),

  // Paradas
  getParadas: () => api.get('/paradas'),
  
  // Avisos
  getAvisos: () => api.get('/avisos'),
  criarAviso: (aviso) => api.post('/avisos', aviso),

  // Alertas de Carona
  getAlertasCarona: () => api.get('/alertas-carona'),
  criarAlertaCarona: (alerta) => api.post('/alertas-carona', alerta),
  desativarAlertaCarona: (id) => api.patch(`/alertas-carona/${id}/desativar`),
};
