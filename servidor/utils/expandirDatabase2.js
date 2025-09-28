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
    const lojas = ['Mercado Livre', 'Magazine Luiza', 'Casas Bahia', 'Amazon', 'Americanas', 'Fast Shop', 'Extra', 'Submarino'];
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
    const lojas = ['OLX', 'Trocafone', 'Mercado Livre', 'Facebook Marketplace', 'Enjoei', 'Shopee'];
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

// Mais 60+ celulares populares para completar os 100+
const maisCelulares = [
  // Mais iPhone variações
  {
    anoLancamento: 2023,
    marca: 'Apple',
    modelo: 'iPhone 15',
    variacao: { armazenamento: '256GB', cor: 'Preto' },
    especificacoes: {
      tela: 'Super Retina XDR OLED 6.1"',
      processador: 'Apple A16 Bionic',
      memoria: '6GB RAM',
      armazenamento: '256GB',
      camera: 'Dual 48MP + 12MP',
      bateria: '3349 mAh',
      sistemaOperacional: 'iOS 17'
    },
    precoBase: 7800
  },
  {
    anoLancamento: 2023,
    marca: 'Apple',
    modelo: 'iPhone 15 Plus',
    variacao: { armazenamento: '256GB', cor: 'Verde' },
    especificacoes: {
      tela: 'Super Retina XDR OLED 6.7"',
      processador: 'Apple A16 Bionic',
      memoria: '6GB RAM',
      armazenamento: '256GB',
      camera: 'Dual 48MP + 12MP',
      bateria: '4383 mAh',
      sistemaOperacional: 'iOS 17'
    },
    precoBase: 8800
  },
  {
    anoLancamento: 2024,
    marca: 'Apple',
    modelo: 'iPhone 16 Plus',
    variacao: { armazenamento: '256GB', cor: 'Ultramarine' },
    especificacoes: {
      tela: 'Super Retina XDR OLED 6.7"',
      processador: 'Apple A18',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Dual 48MP + 12MP',
      bateria: '4674 mAh',
      sistemaOperacional: 'iOS 18'
    },
    precoBase: 9200
  },
  {
    anoLancamento: 2024,
    marca: 'Apple',
    modelo: 'iPhone 16 Pro Max',
    variacao: { armazenamento: '512GB', cor: 'Titânio Branco' },
    especificacoes: {
      tela: 'Super Retina XDR OLED 6.9"',
      processador: 'Apple A18 Pro',
      memoria: '8GB RAM',
      armazenamento: '512GB',
      camera: 'Triple 48MP + 12MP + 12MP',
      bateria: '4685 mAh',
      sistemaOperacional: 'iOS 18'
    },
    precoBase: 13500
  },

  // Mais Samsung Galaxy S e A series
  {
    anoLancamento: 2024,
    marca: 'Samsung',
    modelo: 'Galaxy S24 Ultra',
    variacao: { armazenamento: '512GB', cor: 'Titanium Gray' },
    especificacoes: {
      tela: 'Dynamic AMOLED 2X 6.8"',
      processador: 'Snapdragon 8 Gen 3',
      memoria: '12GB RAM',
      armazenamento: '512GB',
      camera: 'Quad 200MP + 10MP + 50MP + 12MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 9500
  },
  {
    anoLancamento: 2023,
    marca: 'Samsung',
    modelo: 'Galaxy A24',
    variacao: { armazenamento: '128GB', cor: 'Black' },
    especificacoes: {
      tela: 'Super AMOLED 6.5"',
      processador: 'MediaTek Helio G99',
      memoria: '6GB RAM',
      armazenamento: '128GB',
      camera: 'Triple 50MP + 5MP + 2MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 1400
  },
  {
    anoLancamento: 2024,
    marca: 'Samsung',
    modelo: 'Galaxy A25',
    variacao: { armazenamento: '128GB', cor: 'Blue Black' },
    especificacoes: {
      tela: 'Super AMOLED 6.5"',
      processador: 'Exynos 1280',
      memoria: '6GB RAM',
      armazenamento: '128GB',
      camera: 'Triple 50MP + 8MP + 2MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 1600
  },
  {
    anoLancamento: 2024,
    marca: 'Samsung',
    modelo: 'Galaxy A15',
    variacao: { armazenamento: '128GB', cor: 'Blue' },
    especificacoes: {
      tela: 'Super AMOLED 6.5"',
      processador: 'MediaTek Helio G99',
      memoria: '4GB RAM',
      armazenamento: '128GB',
      camera: 'Triple 50MP + 5MP + 2MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 1200
  },

  // Mais Xiaomi Redmi e POCO
  {
    anoLancamento: 2023,
    marca: 'Xiaomi',
    modelo: 'Xiaomi 13T',
    variacao: { armazenamento: '256GB', cor: 'Alpine Blue' },
    especificacoes: {
      tela: 'AMOLED 6.67"',
      processador: 'MediaTek Dimensity 8020-Ultra',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 50MP + 12MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 3200
  },
  {
    anoLancamento: 2024,
    marca: 'Xiaomi',
    modelo: 'Redmi Note 13 Pro+',
    variacao: { armazenamento: '256GB', cor: 'Aurora Purple' },
    especificacoes: {
      tela: 'AMOLED 6.67"',
      processador: 'MediaTek Dimensity 7200-Ultra',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 200MP + 8MP + 2MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 2000
  },
  {
    anoLancamento: 2024,
    marca: 'Xiaomi',
    modelo: 'POCO X6',
    variacao: { armazenamento: '256GB', cor: 'Shadow Gray' },
    especificacoes: {
      tela: 'AMOLED 6.67"',
      processador: 'Snapdragon 7s Gen 2',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 64MP + 8MP + 2MP',
      bateria: '5100 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 1800
  },
  {
    anoLancamento: 2024,
    marca: 'Xiaomi',
    modelo: 'POCO M6',
    variacao: { armazenamento: '128GB', cor: 'Orion Blue' },
    especificacoes: {
      tela: 'IPS LCD 6.74"',
      processador: 'MediaTek Helio G91-Ultra',
      memoria: '6GB RAM',
      armazenamento: '128GB',
      camera: 'Dual 50MP + 0.08MP',
      bateria: '5030 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 900
  },

  // Mais Motorola
  {
    anoLancamento: 2023,
    marca: 'Motorola',
    modelo: 'Edge 40 Neo',
    variacao: { armazenamento: '256GB', cor: 'Black Beauty' },
    especificacoes: {
      tela: 'pOLED 6.55"',
      processador: 'MediaTek Dimensity 7030',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Dual 50MP + 13MP',
      bateria: '4400 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 2400
  },
  {
    anoLancamento: 2024,
    marca: 'Motorola',
    modelo: 'Edge 50 Fusion',
    variacao: { armazenamento: '256GB', cor: 'Marshmallow Blue' },
    especificacoes: {
      tela: 'pOLED 6.7"',
      processador: 'Snapdragon 7s Gen 2',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Dual 50MP + 13MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 2600
  },
  {
    anoLancamento: 2024,
    marca: 'Motorola',
    modelo: 'Moto G84 5G',
    variacao: { armazenamento: '256GB', cor: 'Viva Magenta' },
    especificacoes: {
      tela: 'pOLED 6.55"',
      processador: 'Snapdragon 695',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Dual 50MP + 8MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 1600
  },
  {
    anoLancamento: 2024,
    marca: 'Motorola',
    modelo: 'Moto G24',
    variacao: { armazenamento: '128GB', cor: 'Matte Charcoal' },
    especificacoes: {
      tela: 'IPS LCD 6.56"',
      processador: 'MediaTek Helio G85',
      memoria: '4GB RAM',
      armazenamento: '128GB',
      camera: 'Dual 50MP + 2MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 800
  },

  // Mais Google Pixel
  {
    anoLancamento: 2024,
    marca: 'Google',
    modelo: 'Pixel 8a',
    variacao: { armazenamento: '128GB', cor: 'Bay' },
    especificacoes: {
      tela: 'OLED 6.1"',
      processador: 'Google Tensor G3',
      memoria: '8GB RAM',
      armazenamento: '128GB',
      camera: 'Dual 64MP + 13MP',
      bateria: '4492 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 3600
  },
  {
    anoLancamento: 2024,
    marca: 'Google',
    modelo: 'Pixel 9 Pro XL',
    variacao: { armazenamento: '512GB', cor: 'Hazel' },
    especificacoes: {
      tela: 'LTPO OLED 6.8"',
      processador: 'Google Tensor G4',
      memoria: '16GB RAM',
      armazenamento: '512GB',
      camera: 'Triple 50MP + 48MP + 48MP',
      bateria: '5060 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 9200
  },

  // Mais OnePlus
  {
    anoLancamento: 2024,
    marca: 'OnePlus',
    modelo: 'OnePlus 12R',
    variacao: { armazenamento: '256GB', cor: 'Cool Blue' },
    especificacoes: {
      tela: 'LTPO AMOLED 6.78"',
      processador: 'Snapdragon 8 Gen 2',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 8MP + 2MP',
      bateria: '5500 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 3800
  },
  {
    anoLancamento: 2024,
    marca: 'OnePlus',
    modelo: 'OnePlus Nord CE 4',
    variacao: { armazenamento: '256GB', cor: 'Celadon Marble' },
    especificacoes: {
      tela: 'AMOLED 6.7"',
      processador: 'Snapdragon 7 Gen 3',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Dual 50MP + 8MP',
      bateria: '5500 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 2200
  },

  // Asus ROG Phone e Zenfone
  {
    anoLancamento: 2023,
    marca: 'Asus',
    modelo: 'ROG Phone 7',
    variacao: { armazenamento: '256GB', cor: 'Phantom Black' },
    especificacoes: {
      tela: 'AMOLED 6.78"',
      processador: 'Snapdragon 8 Gen 2',
      memoria: '12GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 13MP + 5MP',
      bateria: '6000 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 5800
  },
  {
    anoLancamento: 2023,
    marca: 'Asus',
    modelo: 'Zenfone 10',
    variacao: { armazenamento: '256GB', cor: 'Aurora Green' },
    especificacoes: {
      tela: 'AMOLED 5.9"',
      processador: 'Snapdragon 8 Gen 2',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Dual 50MP + 13MP',
      bateria: '4300 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 4200
  },

  // Sony Xperia
  {
    anoLancamento: 2023,
    marca: 'Sony',
    modelo: 'Xperia 1 V',
    variacao: { armazenamento: '256GB', cor: 'Black' },
    especificacoes: {
      tela: 'OLED 6.5"',
      processador: 'Snapdragon 8 Gen 2',
      memoria: '12GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 48MP + 12MP + 12MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 7200
  },
  {
    anoLancamento: 2024,
    marca: 'Sony',
    modelo: 'Xperia 10 VI',
    variacao: { armazenamento: '128GB', cor: 'Blue' },
    especificacoes: {
      tela: 'OLED 6.1"',
      processador: 'Snapdragon 6 Gen 1',
      memoria: '8GB RAM',
      armazenamento: '128GB',
      camera: 'Triple 48MP + 8MP + 8MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 2800
  },

  // TCL
  {
    anoLancamento: 2023,
    marca: 'TCL',
    modelo: '40 NXTPAPER',
    variacao: { armazenamento: '256GB', cor: 'Midnight Blue' },
    especificacoes: {
      tela: 'NXTPAPER 6.78"',
      processador: 'MediaTek Dimensity 6020',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 5MP + 2MP',
      bateria: '5010 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 1600
  },
  {
    anoLancamento: 2024,
    marca: 'TCL',
    modelo: '50 Pro NXTPAPER',
    variacao: { armazenamento: '256GB', cor: 'Sage Green' },
    especificacoes: {
      tela: 'NXTPAPER 6.8"',
      processador: 'MediaTek Dimensity 6300',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 108MP + 8MP + 2MP',
      bateria: '5010 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 2000
  },

  // Fairphone
  {
    anoLancamento: 2023,
    marca: 'Fairphone',
    modelo: 'Fairphone 5',
    variacao: { armazenamento: '256GB', cor: 'Sky Blue' },
    especificacoes: {
      tela: 'OLED 6.46"',
      processador: 'Qualcomm QCM6490',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 50MP + TOF',
      bateria: '4200 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 3500
  },

  // Mais Oppo
  {
    anoLancamento: 2024,
    marca: 'Oppo',
    modelo: 'Find X7',
    variacao: { armazenamento: '256GB', cor: 'Ocean Blue' },
    especificacoes: {
      tela: 'LTPO AMOLED 6.78"',
      processador: 'MediaTek Dimensity 9300',
      memoria: '12GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 50MP + 64MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 4800
  },
  {
    anoLancamento: 2024,
    marca: 'Oppo',
    modelo: 'A79',
    variacao: { armazenamento: '256GB', cor: 'Glowing Green' },
    especificacoes: {
      tela: 'IPS LCD 6.72"',
      processador: 'MediaTek Dimensity 6020',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Dual 50MP + 2MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 1800
  },

  // Mais Vivo
  {
    anoLancamento: 2024,
    marca: 'Vivo',
    modelo: 'V40',
    variacao: { armazenamento: '256GB', cor: 'Stellar Silver' },
    especificacoes: {
      tela: 'AMOLED 6.78"',
      processador: 'Snapdragon 7 Gen 3',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Dual 50MP + 50MP',
      bateria: '5500 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 2800
  },
  {
    anoLancamento: 2024,
    marca: 'Vivo',
    modelo: 'Y28',
    variacao: { armazenamento: '128GB', cor: 'Agate Green' },
    especificacoes: {
      tela: 'IPS LCD 6.68"',
      processador: 'MediaTek Helio G85',
      memoria: '8GB RAM',
      armazenamento: '128GB',
      camera: 'Dual 50MP + 0.08MP',
      bateria: '6000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 1200
  },

  // Mais Honor
  {
    anoLancamento: 2024,
    marca: 'Honor',
    modelo: '200 Pro',
    variacao: { armazenamento: '256GB', cor: 'Ocean Cyan' },
    especificacoes: {
      tela: 'AMOLED 6.78"',
      processador: 'Snapdragon 8s Gen 3',
      memoria: '12GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 50MP + 12MP',
      bateria: '5200 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 4200
  },
  {
    anoLancamento: 2024,
    marca: 'Honor',
    modelo: 'X50',
    variacao: { armazenamento: '256GB', cor: 'Emerald Green' },
    especificacoes: {
      tela: 'AMOLED 6.78"',
      processador: 'Snapdragon 6 Gen 1',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Dual 108MP + 2MP',
      bateria: '5800 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 2200
  },

  // Infinix
  {
    anoLancamento: 2023,
    marca: 'Infinix',
    modelo: 'Zero 30',
    variacao: { armazenamento: '256GB', cor: 'Golden Hour' },
    especificacoes: {
      tela: 'AMOLED 6.78"',
      processador: 'MediaTek Dimensity 8020',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 108MP + 13MP + 2MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 2400
  },
  {
    anoLancamento: 2024,
    marca: 'Infinix',
    modelo: 'Note 40 Pro',
    variacao: { armazenamento: '256GB', cor: 'Obsidian Black' },
    especificacoes: {
      tela: 'AMOLED 6.78"',
      processador: 'MediaTek Helio G99 Ultimate',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 108MP + 2MP + 0.08MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 1600
  },

  // Tecno
  {
    anoLancamento: 2023,
    marca: 'Tecno',
    modelo: 'Phantom V Fold',
    variacao: { armazenamento: '256GB', cor: 'Black' },
    especificacoes: {
      tela: 'LTPO AMOLED 7.85" (dobrado)',
      processador: 'MediaTek Dimensity 9000+',
      memoria: '12GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 50MP + 13MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 13'
    },
    precoBase: 8500
  },
  {
    anoLancamento: 2024,
    marca: 'Tecno',
    modelo: 'Camon 30 Pro',
    variacao: { armazenamento: '256GB', cor: 'Norway Blue' },
    especificacoes: {
      tela: 'AMOLED 6.78"',
      processador: 'MediaTek Dimensity 8050',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP + 50MP + 2MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 14'
    },
    precoBase: 2200
  }
];

// Função para popular o banco de dados com mais celulares
async function adicionarMaisCelulares() {
  try {
    console.log('🔄 Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🟢 Conectado ao MongoDB Atlas');
    
    console.log(`📱 Preparando mais ${maisCelulares.length} celulares...`);
    
    const celularesComPrecos = maisCelulares.map(celular => {
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
    console.log('✅ Mais celulares inseridos com sucesso!');
    console.log(`📱 Total de celulares adicionados nesta execução: ${resultado.length}`);
    
    // Estatísticas finais
    const totalCelulares = await Celular.countDocuments();
    const anoStats = await Celular.aggregate([
      { $group: { _id: '$anoLancamento', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);
    const marcaStats = await Celular.aggregate([
      { $group: { _id: '$marca', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log(`\n📊 Estatísticas finais do banco:`);
    console.log(`Total de celulares: ${totalCelulares}`);
    console.log(`\nPor ano:`);
    anoStats.forEach(stat => console.log(`  ${stat._id}: ${stat.count} modelos`));
    console.log(`\nTop marcas:`);
    marcaStats.slice(0, 10).forEach(stat => console.log(`  ${stat._id}: ${stat.count} modelos`));
    
    await mongoose.disconnect();
    console.log('👋 Desconectado do MongoDB');
    
  } catch (error) {
    console.error('❌ Erro ao adicionar mais celulares:', error);
  }
}

// Executar script
adicionarMaisCelulares();