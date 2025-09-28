import axios from 'axios';
import { ModeloCelular, ResultadoPrecos } from '../types/tipos';

// Configuração da URL da API baseada no ambiente
const getApiBaseUrl = (): string => {
  // Em desenvolvimento, usa localhost (servidor Express)
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  }
  // Em produção, usa Netlify Functions
  return import.meta.env.VITE_API_URL || '/.netlify/functions/api/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Aumentado para produção
  headers: {
    'Content-Type': 'application/json',
  },
});

export const buscarAnos = async (): Promise<number[]> => {
  try {
    const response = await api.get('/anos');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar anos:', error);
    throw new Error('Falha ao carregar anos disponíveis');
  }
};

export const buscarMarcas = async (ano: number): Promise<string[]> => {
  try {
    const response = await api.get(`/marcas?ano=${ano}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar marcas:', error);
    throw new Error('Falha ao carregar marcas');
  }
};

export const buscarModelos = async (marca: string, ano: number): Promise<ModeloCelular[]> => {
  try {
    const response = await api.get(`/modelos?marca=${encodeURIComponent(marca)}&ano=${ano}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar modelos:', error);
    throw new Error('Falha ao carregar modelos');
  }
};

export const buscarPrecos = async (idModelo: string): Promise<ResultadoPrecos> => {
  try {
    const response = await api.get(`/precos/${idModelo}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar preços:', error);
    throw new Error('Falha ao consultar preços');
  }
};