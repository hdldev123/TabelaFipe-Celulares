const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Schema do Celular
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

// Conectar ao MongoDB
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('✅ Conectado ao MongoDB');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    throw error;
  }
};

// Middleware para garantir conexão com BD
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ erro: 'Erro de conexão com banco de dados' });
  }
});

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    service: 'Netlify Functions'
  });
});

// Rota para buscar anos
app.get('/api/anos', async (req, res) => {
  try {
    const anos = await Celular.distinct('ano');
    res.json(anos.sort((a, b) => b - a));
  } catch (error) {
    console.error('Erro ao buscar anos:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// Rota para buscar marcas
app.get('/api/marcas', async (req, res) => {
  try {
    const { ano } = req.query;
    const filter = ano ? { ano: parseInt(ano) } : {};
    const marcas = await Celular.distinct('marca', filter);
    res.json(marcas.sort());
  } catch (error) {
    console.error('Erro ao buscar marcas:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// Rota para buscar modelos
app.get('/api/modelos', async (req, res) => {
  try {
    const { ano, marca } = req.query;
    const filter = {};
    if (ano) filter.ano = parseInt(ano);
    if (marca) filter.marca = marca;
    
    const celulares = await Celular.find(filter, { modelo: 1, _id: 1 });
    const modelos = celulares.map(c => ({ 
      id: c._id.toString(), 
      nome: c.modelo 
    }));
    
    res.json(modelos);
  } catch (error) {
    console.error('Erro ao buscar modelos:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// Rota para buscar preços
app.get('/api/precos/:idModelo', async (req, res) => {
  try {
    const { idModelo } = req.params;
    
    const celular = await Celular.findById(idModelo);
    
    if (!celular) {
      return res.status(404).json({ 
        erro: 'Celular não encontrado' 
      });
    }

    res.json({
      celular: {
        id: celular._id,
        marca: celular.marca,
        modelo: celular.modelo,
        ano: celular.ano
      },
      precos: celular.precos.map(preco => ({
        loja: preco.loja,
        preco: preco.preco,
        url: preco.url,
        ultimaAtualizacao: preco.ultimaAtualizacao
      })),
      estatisticas: {
        precoMinimo: Math.min(...celular.precos.map(p => p.preco)),
        precoMaximo: Math.max(...celular.precos.map(p => p.preco)),
        precoMedio: celular.precos.reduce((acc, p) => acc + p.preco, 0) / celular.precos.length,
        totalLojas: celular.precos.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar preços:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// Rota para debug (listar todos os celulares)
app.get('/api/debug/celulares', async (req, res) => {
  try {
    const celulares = await Celular.find({});
    res.json({
      total: celulares.length,
      celulares: celulares.map(c => ({
        id: c._id,
        marca: c.marca,
        modelo: c.modelo,
        ano: c.ano,
        totalPrecos: c.precos.length
      }))
    });
  } catch (error) {
    console.error('Erro ao buscar celulares:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    erro: 'Rota não encontrada',
    path: req.originalUrl 
  });
});

// Export da função para Netlify
module.exports.handler = serverless(app);