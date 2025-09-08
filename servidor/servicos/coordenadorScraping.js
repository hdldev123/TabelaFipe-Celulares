import ScraperMercadoLivre from '../scrapers/mercadoLivreScraper.js';
import ScraperCasasBahia from '../scrapers/casasBahiaScraper.js';
import ScraperMagazineLuiza from '../scrapers/magazineLuizaScraper.js';
import ScraperOLX from '../scrapers/olxScraper.js';
import ScraperTrocafone from '../scrapers/trocafoneScraper.js';
import Celular from '../modelos/celularModel.js';
import { calcularMediana, filtrarPrecosValidos } from '../utils/estatisticas.js';

class CoordenadorScraping {
  constructor() {
    this.scrapers = {
      novos: [
        new ScraperMercadoLivre(),
        new ScraperCasasBahia(),
        new ScraperMagazineLuiza()
      ],
      usados: [
        new ScraperOLX(),
        new ScraperTrocafone()
      ]
    };
  }

  async executarScrapingCompleto() {
    console.log('🚀 Iniciando scraping completo...');
    
    try {
      // Lista de modelos populares para scraping
      const modelosParaScraping = await this.obterModelosParaScraping();
      
      for (const modelo of modelosParaScraping) {
        await this.coletarDadosModelo(modelo);
        // Pausa entre modelos para evitar sobrecarga
        await this.aguardar(2000);
      }
      
      console.log('✅ Scraping completo finalizado');
    } catch (error) {
      console.error('❌ Erro no scraping completo:', error);
      throw error;
    }
  }

  async obterModelosParaScraping() {
    // Busca modelos dos últimos 3 anos para manter dados atualizados
    const anoAtual = new Date().getFullYear();
    const anosParaScraping = [anoAtual, anoAtual - 1, anoAtual - 2];
    
    return await Celular.find({
      anoLancamento: { $in: anosParaScraping }
    }).select('_id modelo marca variacao');
  }

  async coletarDadosModelo(modelo) {
    console.log(`🔍 Coletando dados para: ${modelo.marca} ${modelo.modelo}`);
    
    const termoBusca = `${modelo.marca} ${modelo.modelo} ${modelo.variacao.armazenamento || ''}`.trim();
    
    // Coleta preços novos
    const precosNovos = await this.coletarPrecos(this.scrapers.novos, termoBusca);
    
    // Coleta preços usados
    const precosUsados = await this.coletarPrecos(this.scrapers.usados, termoBusca);
    
    // Filtra e calcula medianas
    const precosNovosValidos = filtrarPrecosValidos(precosNovos);
    const precosUsadosValidos = filtrarPrecosValidos(precosUsados);
    
    const medianaNovas = calcularMediana(precosNovosValidos.map(p => p.valor));
    const medianaUsadas = calcularMediana(precosUsadosValidos.map(p => p.valor));
    
    // Atualiza modelo no banco
    await Celular.findByIdAndUpdate(modelo._id, {
      precosNovos: precosNovosValidos,
      precosUsados: precosUsadosValidos,
      precoMedianoNovo: medianaNovas,
      precoMedianoUsado: medianaUsadas,
      ultimaAtualizacao: new Date()
    });
    
    console.log(`✅ ${modelo.marca} ${modelo.modelo} atualizado - Novo: R$ ${medianaNovas || 'N/A'} | Usado: R$ ${medianaUsadas || 'N/A'}`);
  }

  async coletarPrecos(scrapers, termoBusca) {
    const todosPrecos = [];
    
    for (const scraper of scrapers) {
      try {
        console.log(`  📡 Executando ${scraper.constructor.name}...`);
        const precos = await scraper.buscarPrecos(termoBusca);
        todosPrecos.push(...precos);
        
        // Pausa entre scrapers
        await this.aguardar(1000);
      } catch (error) {
        console.error(`  ❌ Erro no ${scraper.constructor.name}:`, error.message);
      }
    }
    
    return todosPrecos;
  }

  aguardar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const executarScrapingCompleto = async () => {
  const coordenador = new CoordenadorScraping();
  await coordenador.executarScrapingCompleto();
};

export default CoordenadorScraping;