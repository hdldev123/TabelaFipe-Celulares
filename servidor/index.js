import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cron from 'node-cron';
import rotasApi from './rotas/index.js';
import { executarScrapingCompleto } from './servicos/coordenadorScraping.js';

dotenv.config();

const app = express();
const PORTA = process.env.PORTA_SERVIDOR || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

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

app.listen(PORTA, () => {
  console.log(`🚀 Servidor rodando na porta ${PORTA}`);
});