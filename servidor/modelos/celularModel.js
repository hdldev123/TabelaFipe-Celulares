import mongoose from 'mongoose';

const especificacaoSchema = new mongoose.Schema({
  tela: String,
  processador: String,
  memoria: String,
  armazenamento: String,
  camera: String,
  bateria: String,
  sistemaOperacional: String
});

const precoSchema = new mongoose.Schema({
  valor: {
    type: Number,
    required: true
  },
  fonte: {
    type: String,
    required: true
  },
  urlAnuncio: String,
  dataColeta: {
    type: Date,
    default: Date.now
  }
});

const celularSchema = new mongoose.Schema({
  anoLancamento: {
    type: Number,
    required: true,
    index: true
  },
  marca: {
    type: String,
    required: true,
    index: true
  },
  modelo: {
    type: String,
    required: true
  },
  variacao: {
    armazenamento: String,
    cor: String
  },
  especificacoes: especificacaoSchema,
  imagemUrl: String,
  precosNovos: [precoSchema],
  precosUsados: [precoSchema],
  precoMedianoNovo: Number,
  precoMedianoUsado: Number,
  ultimaAtualizacao: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices compostos para otimizar consultas
celularSchema.index({ anoLancamento: 1, marca: 1 });
celularSchema.index({ anoLancamento: 1, marca: 1, modelo: 1 });

export default mongoose.model('Celular', celularSchema);