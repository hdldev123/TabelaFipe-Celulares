import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Celular from '../modelos/celularModel.js';

// Configuração do dotenv para acessar o arquivo .env corretamente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Dados de exemplo para popular o banco
const dadosTeste = [
  // iPhone 14 - Ano 2022
  {
    anoLancamento: 2022,
    marca: 'Apple',
    modelo: 'iPhone 14',
    variacao: {
      armazenamento: '128GB',
      cor: 'Preto'
    },
    especificacoes: {
      tela: 'OLED 6.1 polegadas',
      processador: 'Apple A15 Bionic',
      memoria: '6GB RAM',
      armazenamento: '128GB',
      camera: 'Dual 12MP',
      bateria: '3279 mAh',
      sistemaOperacional: 'iOS 16'
    },
    imagemUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-midnight?wid=2560&hei=1440&fmt=jpeg&qlt=95',
    precosNovos: [
      { valor: 4799, fonte: 'Mercado Livre', urlAnuncio: 'https://exemplo.com/anuncio1', dataColeta: new Date() },
      { valor: 4899, fonte: 'Magazine Luiza', urlAnuncio: 'https://exemplo.com/anuncio2', dataColeta: new Date() },
      { valor: 4699, fonte: 'Casas Bahia', urlAnuncio: 'https://exemplo.com/anuncio3', dataColeta: new Date() },
    ],
    precosUsados: [
      { valor: 3899, fonte: 'OLX', urlAnuncio: 'https://exemplo.com/anuncio4', dataColeta: new Date() },
      { valor: 3799, fonte: 'Trocafone', urlAnuncio: 'https://exemplo.com/anuncio5', dataColeta: new Date() },
    ],
    precoMedianoNovo: 4799,
    precoMedianoUsado: 3849,
    ultimaAtualizacao: new Date()
  },
  // iPhone 13 - Ano 2021
  {
    anoLancamento: 2021,
    marca: 'Apple',
    modelo: 'iPhone 13',
    variacao: {
      armazenamento: '128GB',
      cor: 'Azul'
    },
    especificacoes: {
      tela: 'OLED 6.1 polegadas',
      processador: 'Apple A15 Bionic',
      memoria: '4GB RAM',
      armazenamento: '128GB',
      camera: 'Dual 12MP',
      bateria: '3240 mAh',
      sistemaOperacional: 'iOS 15'
    },
    imagemUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-blue-select-2021?wid=940&hei=1112&fmt=png-alpha',
    precosNovos: [
      { valor: 3899, fonte: 'Mercado Livre', urlAnuncio: 'https://exemplo.com/anuncio6', dataColeta: new Date() },
      { valor: 3999, fonte: 'Magazine Luiza', urlAnuncio: 'https://exemplo.com/anuncio7', dataColeta: new Date() },
    ],
    precosUsados: [
      { valor: 3199, fonte: 'OLX', urlAnuncio: 'https://exemplo.com/anuncio8', dataColeta: new Date() },
      { valor: 3099, fonte: 'Trocafone', urlAnuncio: 'https://exemplo.com/anuncio9', dataColeta: new Date() },
    ],
    precoMedianoNovo: 3949,
    precoMedianoUsado: 3149,
    ultimaAtualizacao: new Date()
  },
  // Samsung Galaxy S23 - Ano 2023
  {
    anoLancamento: 2023,
    marca: 'Samsung',
    modelo: 'Galaxy S23',
    variacao: {
      armazenamento: '256GB',
      cor: 'Preto'
    },
    especificacoes: {
      tela: 'AMOLED 6.1 polegadas',
      processador: 'Snapdragon 8 Gen 2',
      memoria: '8GB RAM',
      armazenamento: '256GB',
      camera: 'Triple 50MP',
      bateria: '3900 mAh',
      sistemaOperacional: 'Android 13'
    },
    imagemUrl: 'https://images.samsung.com/is/image/samsung/p6pim/br/sm-s911bzkczto/gallery/br-galaxy-s23-s911-sm-s911bzkczto-534863-534863-535169-thumb',
    precosNovos: [
      { valor: 4599, fonte: 'Mercado Livre', urlAnuncio: 'https://exemplo.com/anuncio10', dataColeta: new Date() },
      { valor: 4499, fonte: 'Magazine Luiza', urlAnuncio: 'https://exemplo.com/anuncio11', dataColeta: new Date() },
      { valor: 4699, fonte: 'Casas Bahia', urlAnuncio: 'https://exemplo.com/anuncio12', dataColeta: new Date() },
    ],
    precosUsados: [
      { valor: 3799, fonte: 'OLX', urlAnuncio: 'https://exemplo.com/anuncio13', dataColeta: new Date() },
    ],
    precoMedianoNovo: 4599,
    precoMedianoUsado: 3799,
    ultimaAtualizacao: new Date()
  },
  // Samsung Galaxy S22 - Ano 2022
  {
    anoLancamento: 2022,
    marca: 'Samsung',
    modelo: 'Galaxy S22',
    variacao: {
      armazenamento: '128GB',
      cor: 'Branco'
    },
    especificacoes: {
      tela: 'AMOLED 6.1 polegadas',
      processador: 'Snapdragon 8 Gen 1',
      memoria: '8GB RAM',
      armazenamento: '128GB',
      camera: 'Triple 50MP',
      bateria: '3700 mAh',
      sistemaOperacional: 'Android 12'
    },
    imagemUrl: 'https://images.samsung.com/is/image/samsung/p6pim/br/sm-s901ezwjzto/gallery/br-galaxy-s22-s901-sm-s901ezwjzto-531656-531656-thumb',
    precosNovos: [
      { valor: 3499, fonte: 'Mercado Livre', urlAnuncio: 'https://exemplo.com/anuncio14', dataColeta: new Date() },
      { valor: 3399, fonte: 'Magazine Luiza', urlAnuncio: 'https://exemplo.com/anuncio15', dataColeta: new Date() },
    ],
    precosUsados: [
      { valor: 2899, fonte: 'OLX', urlAnuncio: 'https://exemplo.com/anuncio16', dataColeta: new Date() },
      { valor: 2799, fonte: 'Trocafone', urlAnuncio: 'https://exemplo.com/anuncio17', dataColeta: new Date() },
    ],
    precoMedianoNovo: 3449,
    precoMedianoUsado: 2849,
    ultimaAtualizacao: new Date()
  },
  // Xiaomi Redmi Note 12 - Ano 2023
  {
    anoLancamento: 2023,
    marca: 'Xiaomi',
    modelo: 'Redmi Note 12',
    variacao: {
      armazenamento: '128GB',
      cor: 'Verde'
    },
    especificacoes: {
      tela: 'AMOLED 6.67 polegadas',
      processador: 'Snapdragon 685',
      memoria: '6GB RAM',
      armazenamento: '128GB',
      camera: 'Triple 50MP',
      bateria: '5000 mAh',
      sistemaOperacional: 'Android 13'
    },
    imagemUrl: 'https://xiaomiloja.com.br/cdn/shop/files/xiaomi-redmi-note-12-verde_600x600.jpg',
    precosNovos: [
      { valor: 1899, fonte: 'Mercado Livre', urlAnuncio: 'https://exemplo.com/anuncio18', dataColeta: new Date() },
      { valor: 1799, fonte: 'Magazine Luiza', urlAnuncio: 'https://exemplo.com/anuncio19', dataColeta: new Date() },
      { valor: 1849, fonte: 'Casas Bahia', urlAnuncio: 'https://exemplo.com/anuncio20', dataColeta: new Date() },
    ],
    precosUsados: [
      { valor: 1499, fonte: 'OLX', urlAnuncio: 'https://exemplo.com/anuncio21', dataColeta: new Date() },
    ],
    precoMedianoNovo: 1849,
    precoMedianoUsado: 1499,
    ultimaAtualizacao: new Date()
  }
];

// Função para popular o banco de dados
async function popularBancoDados() {
  try {
    console.log('🔄 Configuração do ambiente:', process.env.NODE_ENV);
    console.log('🔌 URI MongoDB:', process.env.MONGODB_URI);
    
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🟢 Conectado ao MongoDB Atlas');
    
    // Limpar coleção existente (opcional)
    await Celular.deleteMany({});
    console.log('🧹 Coleção limpa');
    
    // Inserir dados de teste
    await Celular.insertMany(dadosTeste);
    console.log('✅ Dados de teste inseridos com sucesso!');
    console.log(`📱 Total de celulares inseridos: ${dadosTeste.length}`);
    
    // Desconectar
    await mongoose.disconnect();
    console.log('👋 Desconectado do MongoDB');
  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);
  }
}

// Executar script
popularBancoDados();