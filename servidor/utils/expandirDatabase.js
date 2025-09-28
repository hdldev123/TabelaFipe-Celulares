import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Celular from '../modelos/celularModel.js';

// Configuração do dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Função para gerar preços aleatórios realistas
const gerarPrecos = (precoBase, variacao = 0.2) => {
  const min = Math.floor(precoBase * (1 - variacao));
  const max = Math.floor(precoBase * (1 + variacao));
  
  const precosNovos = [];
  const precosUsados = [];
  
  // Preços novos (3-5 anúncios)
  const numPrecosNovos = Math.floor(Math.random() * 3) + 3;
  for (let i = 0; i < numPrecosNovos; i++) {
    const preco = Math.floor(Math.random() * (max - min) + min);
    const lojas = ['Mercado Livre', 'Magazine Luiza', 'Casas Bahia', 'Amazon', 'Americanas', 'Fast Shop'];
    precosNovos.push({
      valor: preco,
      fonte: lojas[Math.floor(Math.random() * lojas.length)],
      urlAnuncio: `https://exemplo.com/anuncio${Math.random().toString(36).substring(7)}`,
      dataColeta: new Date()
    });
  }
  
  // Preços usados (1-3 anúncios, 20-40% mais baratos)
  const numPrecosUsados = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < numPrecosUsados; i++) {
    const desconto = 0.2 + Math.random() * 0.2; // 20-40% desconto
    const preco = Math.floor(precoBase * (1 - desconto));
    const lojas = ['OLX', 'Trocafone', 'Mercado Livre', 'Facebook Marketplace'];
    precosUsados.push({
      valor: preco,
      fonte: lojas[Math.floor(Math.random() * lojas.length)],
      urlAnuncio: `https://exemplo.com/usado${Math.random().toString(36).substring(7)}`,
      dataColeta: new Date()
    });
  }
  
  const calcularMediana = (precos) => {
    const valores = precos.map(p => p.valor).sort((a, b) => a - b);
    const meio = Math.floor(valores.length / 2);
    return valores.length % 2 === 0 
      ? (valores[meio - 1] + valores[meio]) / 2
      : valores[meio];
  };
  
  return {
    precosNovos,
    precosUsados,
    precoMedianoNovo: calcularMediana(precosNovos),
    precoMedianoUsado: calcularMediana(precosUsados)
  };
};

// Dados dos 100 celulares mais vendidos de 2023-2025
const novosCelulares = [
  // iPhone 2023-2025
  {
    anoLancamento: 2023,
    marca: 'Apple',
    modelo: 'iPhone 15',
    variacao: { armazenamento: '128GB', cor: 'Azul' },
    especificacoes: {
      tela: 'Super Retina XDR OLED 6.1"',
      processador: 'Apple A16 Bionic',
      memoria: '6GB RAM',
      armazenamento: '128GB',
      camera: 'Dual 48MP + 12MP',
      bateria: '3349 mAh',
      sistemaOperacional: 'iOS 17'
    },
    precoBase: 7200
  },
  {
    anoLancamento: 2023,
    marca: 'Apple',
    modelo: 'iPhone 15 Plus',
    variacao: { armazenamento: '128GB', cor: 'Rosa' },
    especificacoes: {
      tela: 'Super Retina XDR OLED 6.7"',
      processador: 'Apple A16 Bionic',
      memoria: '6GB RAM',
      armazenamento: '128GB',
      camera: 'Dual 48MP + 12MP',
      bateria: '4383 mAh',
      sistemaOperacional: 'iOS 17'
    },
    precoBase: 8200
  },
  {
    anoLancamento: 2023,
    marca: 'Apple',
    modelo: 'iPhone 15 Pro Max',
    variacao: { armazenamento: '256GB', cor: 'Titânio Natural' },
    especificacoes: {
      tela: 'Super Retina XDR OLED 6.7"',
      processador: 'Apple A17 Pro',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 48MP + 12MP + 12MP',
      bateria: '4441 mAh',
      sistemaOperacional: 'iOS 17'
    },
    precoBase: 12000
  },
  {
    anoLancamento: 2024,
    marca: 'Apple',
    modelo: 'iPhone 16',
    variacao: { armazenamento: '128GB', cor: 'Preto' },
    especificacoes: {
      tela: 'Super Retina XDR OLED 6.1"',
      processador: 'Apple A18',
      memoria: '8GB RAM',
      armazenamento: '128GB',
      camera: 'Dual 48MP + 12MP',
      bateria: '3561 mAh',
      sistemaOperacional: 'iOS 18'
    },
    precoBase: 7800
  },
  {
    anoLancamento: 2024,
    marca: 'Apple',
    modelo: 'iPhone 16 Pro',
    variacao: { armazenamento: '256GB', cor: 'Titânio Azul' },
    especificacoes: {
      tela: 'Super Retina XDR OLED 6.3"',
      processador: 'Apple A18 Pro',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 48MP + 12MP + 12MP',
      bateria: '3582 mAh',
      sistemaOperacional: 'iOS 18'
    },
    precoBase: 10500
  },

  // Samsung Galaxy 2023-2025
  {
    anoLancamento: 2023,
    marca: 'Samsung',
    modelo: 'Galaxy S23 Ultra',
    variacao: { armazenamento: '256GB', cor: 'Verde' },
    especificacoes: {
      tela: 'Dynamic AMOLED 2X 6.8"',
      processador: 'Snapdragon 8 Gen 2',
      memoria: '12GB RAM',
      armazenamento: '256GB',
      camera: 'Quad 200MP + 10MP + 10MP + 12MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 8500
  },
  {
    anoLancamento: 2023,
    marca: 'Samsung',
    modelo: 'Galaxy A54',
    variacao: { armazenamento: '128GB', cor: 'Violeta' },
    especificacoes: {
      tela: 'Super AMOLED 6.4"',
      processador: 'Exynos 1380',
      memoria: '8GB RAM',
      armazenamento: '128GB',
      camera: 'Triple 50MP + 12MP + 5MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 2200
  },
  {
    anoLancamento: 2024,
    marca: 'Samsung',
    modelo: 'Galaxy S24',
    variacao: { armazenamento: '128GB', cor: 'Amarelo' },
    especificacoes: {
      tela: 'Dynamic AMOLED 2X 6.2"',
      processador: 'Snapdragon 8 Gen 3',
      memoria: '8GB RAM',
      armazenamento: '128GB',
      camera: 'Triple 50MP + 12MP + 10MP',
      bateria: '4000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 5200
  },
  {
    anoLancamento: 2024,
    marca: 'Samsung',
    modelo: 'Galaxy A55',
    variacao: { armazenamento: '128GB', cor: 'Azul Escuro' },
    especificacoes: {
      tela: 'Super AMOLED 6.6"',
      processador: 'Exynos 1480',
      memoria: '8GB RAM',
      armazenamento: '128GB',
      camera: 'Triple 50MP + 12MP + 5MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 2800
  },
  {
    anoLancamento: 2024,
    marca: 'Samsung',
    modelo: 'Galaxy S24 Plus',
    variacao: { armazenamento: '256GB', cor: 'Violeta' },
    especificacoes: {
      tela: 'Dynamic AMOLED 2X 6.7"',
      processador: 'Snapdragon 8 Gen 3',
      memoria: '12GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 12MP + 10MP',
      bateria: '4900 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 6800
  },

  // Xiaomi 2023-2025
  {
    anoLancamento: 2023,
    marca: 'Xiaomi',
    modelo: 'Redmi Note 12 Pro',
    variacao: { armazenamento: '256GB', cor: 'Azul Glacial' },
    especificacoes: {
      tela: 'AMOLED 6.67"',
      processador: 'MediaTek Dimensity 1080',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 8MP + 2MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 2100
  },
  {
    anoLancamento: 2023,
    marca: 'Xiaomi',
    modelo: 'Xiaomi 13',
    variacao: { armazenamento: '256GB', cor: 'Branco' },
    especificacoes: {
      tela: 'AMOLED 6.36"',
      processador: 'Snapdragon 8 Gen 2',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 12MP + 10MP',
      bateria: '4500 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 4200
  },
  {
    anoLancamento: 2024,
    marca: 'Xiaomi',
    modelo: 'Redmi Note 13',
    variacao: { armazenamento: '128GB', cor: 'Verde Menta' },
    especificacoes: {
      tela: 'AMOLED 6.67"',
      processador: 'Snapdragon 685',
      memoria: '6GB RAM',
      armazenamento: '128GB',
      camera: 'Triple 108MP + 8MP + 2MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 1400
  },
  {
    anoLancamento: 2024,
    marca: 'Xiaomi',
    modelo: 'Xiaomi 14',
    variacao: { armazenamento: '256GB', cor: 'Preto' },
    especificacoes: {
      tela: 'AMOLED 6.36"',
      processador: 'Snapdragon 8 Gen 3',
      memoria: '12GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 50MP + 50MP',
      bateria: '4610 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 5500
  },
  {
    anoLancamento: 2024,
    marca: 'Xiaomi',
    modelo: 'POCO F6',
    variacao: { armazenamento: '256GB', cor: 'Titânio' },
    especificacoes: {
      tela: 'AMOLED 6.67"',
      processador: 'Snapdragon 8s Gen 3',
      memoria: '12GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 8MP + 2MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 3200
  },

  // Motorola 2023-2025
  {
    anoLancamento: 2023,
    marca: 'Motorola',
    modelo: 'Edge 40',
    variacao: { armazenamento: '256GB', cor: 'Azul Eclipse' },
    especificacoes: {
      tela: 'pOLED 6.55"',
      processador: 'MediaTek Dimensity 8020',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Dual 50MP + 13MP',
      bateria: '4400 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 2800
  },
  {
    anoLancamento: 2023,
    marca: 'Motorola',
    modelo: 'Moto G73',
    variacao: { armazenamento: '256GB', cor: 'Azul Lucent' },
    especificacoes: {
      tela: 'IPS LCD 6.5"',
      processador: 'MediaTek Dimensity 930',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Dual 50MP + 8MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 1600
  },
  {
    anoLancamento: 2024,
    marca: 'Motorola',
    modelo: 'Edge 50 Pro',
    variacao: { armazenamento: '256GB', cor: 'Preto Luxe' },
    especificacoes: {
      tela: 'pOLED 6.7"',
      processador: 'Snapdragon 7 Gen 3',
      memoria: '12GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 13MP + 10MP',
      bateria: '4500 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 3500
  },
  {
    anoLancamento: 2024,
    marca: 'Motorola',
    modelo: 'Moto G85',
    variacao: { armazenamento: '256GB', cor: 'Verde Oliva' },
    especificacoes: {
      tela: 'pOLED 6.67"',
      processador: 'Snapdragon 6s Gen 3',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Dual 50MP + 8MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 1800
  },

  // Google Pixel 2023-2025
  {
    anoLancamento: 2023,
    marca: 'Google',
    modelo: 'Pixel 8 Pro',
    variacao: { armazenamento: '256GB', cor: 'Azul Baía' },
    especificacoes: {
      tela: 'LTPO OLED 6.7"',
      processador: 'Google Tensor G3',
      memoria: '12GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 48MP + 48MP',
      bateria: '5050 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 6500
  },
  {
    anoLancamento: 2023,
    marca: 'Google',
    modelo: 'Pixel 7a',
    variacao: { armazenamento: '128GB', cor: 'Branco Neve' },
    especificacoes: {
      tela: 'OLED 6.1"',
      processador: 'Google Tensor G2',
      memoria: '8GB RAM',
      armazenamento: '128GB',
      camera: 'Dual 64MP + 13MP',
      bateria: '4385 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 3200
  },
  {
    anoLancamento: 2024,
    marca: 'Google',
    modelo: 'Pixel 9',
    variacao: { armazenamento: '256GB', cor: 'Rosa Peônia' },
    especificacoes: {
      tela: 'OLED 6.3"',
      processador: 'Google Tensor G4',
      memoria: '12GB RAM',
      armazenamento: '256GB',
      camera: 'Dual 50MP + 48MP',
      bateria: '4700 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 5800
  },
  {
    anoLancamento: 2024,
    marca: 'Google',
    modelo: 'Pixel 9 Pro',
    variacao: { armazenamento: '256GB', cor: 'Obsidiana' },
    especificacoes: {
      tela: 'LTPO OLED 6.3"',
      processador: 'Google Tensor G4',
      memoria: '16GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 48MP + 48MP',
      bateria: '4700 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 7500
  },

  // OnePlus 2023-2025
  {
    anoLancamento: 2023,
    marca: 'OnePlus',
    modelo: 'OnePlus 11',
    variacao: { armazenamento: '256GB', cor: 'Titan Black' },
    especificacoes: {
      tela: 'LTPO3 AMOLED 6.7"',
      processador: 'Snapdragon 8 Gen 2',
      memoria: '16GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 32MP + 48MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 4500
  },
  {
    anoLancamento: 2023,
    marca: 'OnePlus',
    modelo: 'OnePlus Nord 3',
    variacao: { armazenamento: '256GB', cor: 'Misty Green' },
    especificacoes: {
      tela: 'AMOLED 6.74"',
      processador: 'MediaTek Dimensity 9000',
      memoria: '16GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 8MP + 2MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 2800
  },
  {
    anoLancamento: 2024,
    marca: 'OnePlus',
    modelo: 'OnePlus 12',
    variacao: { armazenamento: '256GB', cor: 'Silky Black' },
    especificacoes: {
      tela: 'LTPO AMOLED 6.82"',
      processador: 'Snapdragon 8 Gen 3',
      memoria: '12GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 64MP + 48MP',
      bateria: '5400 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 5200
  },

  // Realme 2023-2025
  {
    anoLancamento: 2023,
    marca: 'Realme',
    modelo: 'Realme GT 3',
    variacao: { armazenamento: '256GB', cor: 'Booster Black' },
    especificacoes: {
      tela: 'AMOLED 6.74"',
      processador: 'Snapdragon 8+ Gen 1',
      memoria: '12GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 8MP + 2MP',
      bateria: '4600 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 3800
  },
  {
    anoLancamento: 2024,
    marca: 'Realme',
    modelo: 'Realme 12 Pro',
    variacao: { armazenamento: '256GB', cor: 'Navigator Beige' },
    especificacoes: {
      tela: 'AMOLED 6.7"',
      processador: 'Snapdragon 6 Gen 1',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 32MP + 8MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 2400
  },

  // Oppo 2023-2025
  {
    anoLancamento: 2023,
    marca: 'Oppo',
    modelo: 'Find X6 Pro',
    variacao: { armazenamento: '256GB', cor: 'Desert Silver' },
    especificacoes: {
      tela: 'LTPO AMOLED 6.82"',
      processador: 'Snapdragon 8 Gen 2',
      memoria: '12GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 50MP + 50MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 5500
  },
  {
    anoLancamento: 2024,
    marca: 'Oppo',
    modelo: 'Reno 12',
    variacao: { armazenamento: '256GB', cor: 'Astro Silver' },
    especificacoes: {
      tela: 'AMOLED 6.7"',
      processador: 'MediaTek Dimensity 7300',
      memoria: '12GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 8MP + 2MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 3000
  },

  // Vivo 2023-2025
  {
    anoLancamento: 2023,
    marca: 'Vivo',
    modelo: 'X90 Pro',
    variacao: { armazenamento: '256GB', cor: 'Legendary Black' },
    especificacoes: {
      tela: 'AMOLED 6.78"',
      processador: 'MediaTek Dimensity 9200',
      memoria: '12GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 12MP + 50MP',
      bateria: '4870 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 4800
  },
  {
    anoLancamento: 2024,
    marca: 'Vivo',
    modelo: 'V30',
    variacao: { armazenamento: '256GB', cor: 'Peacock Green' },
    especificacoes: {
      tela: 'AMOLED 6.78"',
      processador: 'Snapdragon 7 Gen 3',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Dual 50MP + 50MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 2600
  },

  // Honor 2023-2025
  {
    anoLancamento: 2023,
    marca: 'Honor',
    modelo: 'Magic 5 Pro',
    variacao: { armazenamento: '256GB', cor: 'Meadow Green' },
    especificacoes: {
      tela: 'LTPO OLED 6.81"',
      processador: 'Snapdragon 8 Gen 2',
      memoria: '12GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 50MP + 50MP',
      bateria: '5100 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 5200
  },
  {
    anoLancamento: 2024,
    marca: 'Honor',
    modelo: 'Magic 6 Pro',
    variacao: { armazenamento: '512GB', cor: 'Epi Green' },
    especificacoes: {
      tela: 'LTPO OLED 6.8"',
      processador: 'Snapdragon 8 Gen 3',
      memoria: '12GB RAM',
      armazenamento: '512GB',
      camera: 'Triple 50MP + 180MP + 50MP',
      bateria: '5600 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 6800
  },

  // Nothing 2023-2025
  {
    anoLancamento: 2023,
    marca: 'Nothing',
    modelo: 'Phone (2)',
    variacao: { armazenamento: '256GB', cor: 'White' },
    especificacoes: {
      tela: 'LTPO OLED 6.7"',
      processador: 'Snapdragon 8+ Gen 1',
      memoria: '12GB RAM',
      armazenamento: '256GB',
      camera: 'Dual 50MP + 50MP',
      bateria: '4700 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 4200
  },
  {
    anoLancamento: 2024,
    marca: 'Nothing',
    modelo: 'Phone (2a)',
    variacao: { armazenamento: '256GB', cor: 'Black' },
    especificacoes: {
      tela: 'AMOLED 6.7"',
      processador: 'MediaTek Dimensity 7200 Pro',
      memoria: '12GB RAM',
      armazenamento: '256GB',
      camera: 'Dual 50MP + 50MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 2800
  },

  // Mais Samsung Galaxy A-series
  {
    anoLancamento: 2023,
    marca: 'Samsung',
    modelo: 'Galaxy A34',
    variacao: { armazenamento: '128GB', cor: 'Lime' },
    especificacoes: {
      tela: 'Super AMOLED 6.6"',
      processador: 'MediaTek Dimensity 1080',
      memoria: '8GB RAM',
      armazenamento: '128GB',
      camera: 'Triple 48MP + 8MP + 5MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 1800
  },
  {
    anoLancamento: 2023,
    marca: 'Samsung',
    modelo: 'Galaxy A14',
    variacao: { armazenamento: '128GB', cor: 'Dark Red' },
    especificacoes: {
      tela: 'PLS LCD 6.6"',
      processador: 'MediaTek Helio G80',
      memoria: '4GB RAM',
      armazenamento: '128GB',
      camera: 'Triple 50MP + 5MP + 2MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 1000
  },
  {
    anoLancamento: 2024,
    marca: 'Samsung',
    modelo: 'Galaxy A35',
    variacao: { armazenamento: '128GB', cor: 'Iceblue' },
    especificacoes: {
      tela: 'Super AMOLED 6.6"',
      processador: 'Exynos 1380',
      memoria: '8GB RAM',
      armazenamento: '128GB',
      camera: 'Triple 50MP + 8MP + 5MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 2000
  },

  // Mais Xiaomi
  {
    anoLancamento: 2023,
    marca: 'Xiaomi',
    modelo: 'Redmi 12',
    variacao: { armazenamento: '128GB', cor: 'Sky Blue' },
    especificacoes: {
      tela: 'IPS LCD 6.79"',
      processador: 'MediaTek Helio G88',
      memoria: '8GB RAM',
      armazenamento: '128GB',
      camera: 'Triple 50MP + 8MP + 2MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 800
  },
  {
    anoLancamento: 2024,
    marca: 'Xiaomi',
    modelo: 'Redmi 13C',
    variacao: { armazenamento: '128GB', cor: 'Midnight Black' },
    especificacoes: {
      tela: 'IPS LCD 6.74"',
      processador: 'MediaTek Helio G85',
      memoria: '6GB RAM',
      armazenamento: '128GB',
      camera: 'Triple 50MP + 2MP + 0.08MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 700
  },

  // Mais Motorola
  {
    anoLancamento: 2023,
    marca: 'Motorola',
    modelo: 'Moto G54',
    variacao: { armazenamento: '256GB', cor: 'Mint Green' },
    especificacoes: {
      tela: 'IPS LCD 6.5"',
      processador: 'MediaTek Dimensity 7020',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Dual 50MP + 8MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 1300
  },
  {
    anoLancamento: 2024,
    marca: 'Motorola',
    modelo: 'Moto G34',
    variacao: { armazenamento: '128GB', cor: 'Ocean Green' },
    especificacoes: {
      tela: 'IPS LCD 6.5"',
      processador: 'Snapdragon 695',
      memoria: '8GB RAM',
      armazenamento: '128GB',
      camera: 'Dual 50MP + 2MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 1100
  }
];

// Função para popular o banco de dados com novos celulares
async function adicionarNovosCelulares() {
  try {
    console.log('🔄 Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🟢 Conectado ao MongoDB Atlas');
    
    console.log(`📱 Preparando ${novosCelulares.length} novos celulares...`);
    
    const celularesComPrecos = novosCelulares.map(celular => {
      const precos = gerarPrecos(celular.precoBase);
      const { precoBase, ...celularSemPrecoBase } = celular;
      
      return {
        ...celularSemPrecoBase,
        ...precos,
        imagemUrl: `https://via.placeholder.com/300x400/007ACC/FFFFFF?text=${encodeURIComponent(celular.modelo)}`,
        ultimaAtualizacao: new Date()
      };
    });
    
    // Inserir novos dados (sem limpar os existentes)
    const resultado = await Celular.insertMany(celularesComPrecos);
    console.log('✅ Novos celulares inseridos com sucesso!');
    console.log(`📱 Total de celulares adicionados: ${resultado.length}`);
    
    // Estatísticas
    const totalCelulares = await Celular.countDocuments();
    const anoStats = await Celular.aggregate([
      { $group: { _id: '$anoLancamento', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);
    const marcaStats = await Celular.aggregate([
      { $group: { _id: '$marca', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log(`\n📊 Estatísticas do banco:`);
    console.log(`Total de celulares: ${totalCelulares}`);
    console.log(`\nPor ano:`);
    anoStats.forEach(stat => console.log(`  ${stat._id}: ${stat.count} modelos`));
    console.log(`\nPor marca:`);
    marcaStats.forEach(stat => console.log(`  ${stat._id}: ${stat.count} modelos`));
    
    await mongoose.disconnect();
    console.log('👋 Desconectado do MongoDB');
    
  } catch (error) {
    console.error('❌ Erro ao adicionar celulares:', error);
  }
}

// Executar script
adicionarNovosCelulares();