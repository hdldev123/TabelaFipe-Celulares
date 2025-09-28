import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar .env do servidor
dotenv.config({ path: join(__dirname, '../servidor/.env') });

console.log('🔄 Configuração do ambiente:', process.env.NODE_ENV || 'development');
console.log('🔌 URI MongoDB:', process.env.MONGODB_URI ? 'Configurada' : 'NÃO CONFIGURADA');

const celularSchema = new mongoose.Schema({
  marca: String,
  modelo: String,
  ano: Number,
  precos: [{
    loja: String,
    preco: Number,
    url: String,
    ultimaAtualizacao: { type: Date, default: Date.now }
  }]
});

const Celular = mongoose.model('Celular', celularSchema);

const celulares = [
  {
    marca: "Apple",
    modelo: "iPhone 15 Pro",
    ano: 2023,
    precos: [
      { loja: "Apple Store", preco: 7999, url: "https://apple.com" },
      { loja: "Amazon", preco: 7599, url: "https://amazon.com.br" },
      { loja: "Magazine Luiza", preco: 7799, url: "https://magazineluiza.com.br" },
      { loja: "Casas Bahia", preco: 7899, url: "https://casasbahia.com.br" }
    ]
  },
  {
    marca: "Samsung",
    modelo: "Galaxy S24 Ultra",
    ano: 2024,
    precos: [
      { loja: "Samsung", preco: 6999, url: "https://samsung.com.br" },
      { loja: "Casas Bahia", preco: 6599, url: "https://casasbahia.com.br" },
      { loja: "Americanas", preco: 6799, url: "https://americanas.com.br" },
      { loja: "Amazon", preco: 6699, url: "https://amazon.com.br" }
    ]
  },
  {
    marca: "Xiaomi",
    modelo: "Redmi Note 13 Pro",
    ano: 2023,
    precos: [
      { loja: "Xiaomi Store", preco: 1599, url: "https://xiaomi.com.br" },
      { loja: "Amazon", preco: 1499, url: "https://amazon.com.br" },
      { loja: "Shopee", preco: 1399, url: "https://shopee.com.br" },
      { loja: "Mercado Livre", preco: 1449, url: "https://mercadolivre.com.br" }
    ]
  },
  {
    marca: "Motorola",
    modelo: "Moto G84",
    ano: 2023,
    precos: [
      { loja: "Motorola", preco: 1299, url: "https://motorola.com.br" },
      { loja: "Magazine Luiza", preco: 1199, url: "https://magazineluiza.com.br" },
      { loja: "Amazon", preco: 1249, url: "https://amazon.com.br" },
      { loja: "OLX", preco: 999, url: "https://olx.com.br" }
    ]
  },
  {
    marca: "Google",
    modelo: "Pixel 8",
    ano: 2023,
    precos: [
      { loja: "Google Store", preco: 4999, url: "https://store.google.com" },
      { loja: "Amazon", preco: 4799, url: "https://amazon.com.br" },
      { loja: "Mercado Livre", preco: 4699, url: "https://mercadolivre.com.br" }
    ]
  }
];

async function populateDatabase() {
  try {
    console.log('🔌 Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🟢 Conectado ao MongoDB Atlas');
    
    console.log('🧹 Limpando coleção existente...');
    await Celular.deleteMany({});
    console.log('🧹 Coleção limpa');
    
    console.log('📱 Inserindo dados de teste...');
    await Celular.insertMany(celulares);
    console.log('✅ Dados de teste inseridos com sucesso!');
    
    const total = await Celular.countDocuments();
    console.log(`📱 Total de celulares inseridos: ${total}`);
    
    // Mostrar resumo dos dados
    for (const celular of celulares) {
      const precoMin = Math.min(...celular.precos.map(p => p.preco));
      const precoMax = Math.max(...celular.precos.map(p => p.preco));
      console.log(`📱 ${celular.marca} ${celular.modelo} (${celular.ano}) - R$ ${precoMin} a R$ ${precoMax}`);
    }
    
    console.log('👋 Desconectando do MongoDB');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

populateDatabase();