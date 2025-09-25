import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cron from 'node-cron';
import rotasApi from './rotas/index.js';
import { executarScrapingCompleto } from './servicos/coordenadorScraping.js';

dotenv.config();

const app = express();
const PORTA = process.env.PORT || process.env.PORTA_SERVIDOR || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Configuração do CORS baseada no ambiente
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://tabela-fipe-celulares.vercel.app', 'https://tabela-fipe-celulares.netlify.app']
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Rota de health check para serviços de hospedagem
app.get('/', (req, res) => {
  res.json({ 
    message: 'API TabelaFipe-Celulares funcionando!', 
    version: '1.0.0',
    environment: NODE_ENV 
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rotas da API
app.use('/api', rotasApi);

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('🟢 Conectado ao MongoDB'))
  .catch(err => console.error('🔴 Erro ao conectar ao MongoDB:', err));

// Agendamento de scraping (Domingos e Quartas às 02:00)
cron.schedule('0 2 * * 0,3', async () => {
  console.log('🤖 Iniciando scraping automático...');
  try {
    await executarScrapingCompleto();
    console.log('✅ Scraping automático concluído');
  } catch (error) {
    console.error('❌ Erro no scraping automático:', error);
  }
}, {
  timezone: "America/Sao_Paulo"
});

app.listen(PORTA, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORTA}`);
  console.log(`🌍 Ambiente: ${NODE_ENV}`);
  if (NODE_ENV === 'development') {
    console.log(`📱 Frontend: http://localhost:5173`);
  }
});