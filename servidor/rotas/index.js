import express from 'express';
import Celular from '../modelos/celularModel.js';

const router = express.Router();

// GET /api/anos - Retorna anos disponíveis
router.get('/anos', async (req, res) => {
  try {
    const anos = await Celular.distinct('anoLancamento').sort({ _id: -1 });
    res.json(anos);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar anos', detalhes: error.message });
  }
});

// GET /api/marcas?ano=[ano] - Retorna marcas do ano selecionado
router.get('/marcas', async (req, res) => {
  try {
    const { ano } = req.query;
    
    if (!ano) {
      return res.status(400).json({ erro: 'Parâmetro ano é obrigatório' });
    }

    const marcas = await Celular.distinct('marca', { 
      anoLancamento: parseInt(ano) 
    }).sort();
    
    res.json(marcas);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar marcas', detalhes: error.message });
  }
});

// GET /api/modelos?marca=[marca]&ano=[ano] - Retorna modelos
router.get('/modelos', async (req, res) => {
  try {
    const { marca, ano } = req.query;
    
    if (!marca || !ano) {
      return res.status(400).json({ erro: 'Parâmetros marca e ano são obrigatórios' });
    }

    const modelos = await Celular.find({
      anoLancamento: parseInt(ano),
      marca: marca
    }).select('_id modelo variacao precoMedianoNovo precoMedianoUsado');

    const modelosFormatados = modelos.map(m => ({
      id: m._id,
      nome: `${m.modelo} ${m.variacao.armazenamento || ''} - ${m.variacao.cor || ''}`.trim(),
      temPrecoNovo: m.precoMedianoNovo > 0,
      temPrecoUsado: m.precoMedianoUsado > 0
    }));

    res.json(modelosFormatados);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar modelos', detalhes: error.message });
  }
});

// GET /api/precos/:idModelo - Retorna preços do modelo
router.get('/precos/:idModelo', async (req, res) => {
  try {
    const { idModelo } = req.params;
    
    const celular = await Celular.findById(idModelo);
    
    if (!celular) {
      return res.status(404).json({ erro: 'Modelo não encontrado' });
    }

    // Função para calcular mediana
    const calcularMediana = (precos) => {
      if (!precos || precos.length === 0) return null;
      const valores = precos.map(p => p.preco).filter(p => p && !isNaN(p)).sort((a, b) => a - b);
      if (valores.length === 0) return null;
      const meio = Math.floor(valores.length / 2);
      return valores.length % 2 === 0 
        ? (valores[meio - 1] + valores[meio]) / 2
        : valores[meio];
    };

    // Usar os preços já calculados do banco ou calcular se necessário
    const precoMedianoNovo = celular.precoMedianoNovo || calcularMediana(celular.precosNovos || []);
    const precoMedianoUsado = celular.precoMedianoUsado || calcularMediana(celular.precosUsados || []);

    const resultado = {
      modelo: {
        nome: `${celular.modelo} ${celular.variacao?.armazenamento || ''} - ${celular.variacao?.cor || ''}`.trim(),
        marca: celular.marca,
        anoLancamento: celular.anoLancamento,
        imagem: celular.imagemUrl,
        especificacoes: celular.especificacoes
      },
      precos: {
        novo: precoMedianoNovo,
        usado: precoMedianoUsado
      },
      estatisticas: {
        totalAnunciosNovos: celular.totalAnunciosNovos || (celular.precosNovos ? celular.precosNovos.length : 0),
        totalAnunciosUsados: celular.totalAnunciosUsados || (celular.precosUsados ? celular.precosUsados.length : 0),
        ultimaAtualizacao: celular.ultimaAtualizacao
      }
    };

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar preços', detalhes: error.message });
  }
});

// GET /api/debug/celulares - Lista todos os celulares (apenas para teste)
router.get('/debug/celulares', async (req, res) => {
  try {
    const celulares = await Celular.find().limit(20);
    res.json(celulares);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar celulares', detalhes: error.message });
  }
});

// GET /api/debug/celular/:id - Debug de celular específico
router.get('/debug/celular/:id', async (req, res) => {
  try {
    const celular = await Celular.findById(req.params.id);
    res.json({
      id: celular._id,
      modelo: celular.modelo,
      marca: celular.marca,
      precos: celular.precos,
      precosNovos: celular.precosNovos,
      precosUsados: celular.precosUsados,
      precoMedianoNovo: celular.precoMedianoNovo,
      precoMedianoUsado: celular.precoMedianoUsado
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar celular', detalhes: error.message });
  }
});



export default router;