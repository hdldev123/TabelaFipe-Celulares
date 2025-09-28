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
    
    // Coleta preços novos (quantidade padrão)
    console.log(`  📱 Coletando preços NOVOS...`);
    const precosNovos = await this.coletarPrecos(this.scrapers.novos, termoBusca, { tipo: 'novo' });
    
    // Coleta preços usados (quantidade maior para mais precisão)
    console.log(`  📱 Coletando preços USADOS (amostra ampliada)...`);
    const precosUsados = await this.coletarPrecos(this.scrapers.usados, termoBusca, { tipo: 'usado' });
    
    // Filtra e calcula estatísticas avançadas
    const precosNovosValidos = filtrarPrecosValidos(precosNovos);
    const precosUsadosValidos = filtrarPrecosValidos(precosUsados);
    
    const statsNovos = this.calcularEstatisticas(precosNovosValidos.map(p => p.valor));
    const statsUsados = this.calcularEstatisticas(precosUsadosValidos.map(p => p.valor));
    
    // Atualiza modelo no banco com mais informações
    await Celular.findByIdAndUpdate(modelo._id, {
      precosNovos: precosNovosValidos,
      precosUsados: precosUsadosValidos,
      precoMedianoNovo: statsNovos.mediana,
      precoMedianoUsado: statsUsados.mediana,
      estatisticasNovos: statsNovos,
      estatisticasUsados: statsUsados,
      totalAnunciosNovos: precosNovosValidos.length,
      totalAnunciosUsados: precosUsadosValidos.length,
      ultimaAtualizacao: new Date()
    });
    
    console.log(`✅ ${modelo.marca} ${modelo.modelo} atualizado:`);
    console.log(`   📊 Novos: ${precosNovosValidos.length} anúncios - Mediana: R$ ${statsNovos.mediana || 'N/A'}`);
    console.log(`   📊 Usados: ${precosUsadosValidos.length} anúncios - Mediana: R$ ${statsUsados.mediana || 'N/A'}`);
  }

  calcularEstatisticas(precos) {
    if (!precos.length) return { mediana: null, media: null, min: null, max: null };
    
    const precosOrdenados = precos.sort((a, b) => a - b);
    const mediana = calcularMediana(precos);
    const media = precos.reduce((sum, p) => sum + p, 0) / precos.length;
    const min = Math.min(...precos);
    const max = Math.max(...precos);
    
    return {
      mediana: Math.round(mediana),
      media: Math.round(media),
      min,
      max,
      total: precos.length
    };
  }

  async coletarPrecos(scrapers, termoBusca, opcoes = {}) {
    const todosPrecos = [];
    
    for (const scraper of scrapers) {
      try {
        console.log(`  📡 Executando ${scraper.constructor.name}...`);
        const precos = await scraper.buscarPrecos(termoBusca, opcoes);
        todosPrecos.push(...precos);
        
        console.log(`     💰 ${precos.length} preços coletados de ${scraper.nome}`);
        
        // Pausa entre scrapers
        await this.aguardar(1500);
      } catch (error) {
        console.error(`  ❌ Erro no ${scraper.constructor.name}:`, error.message);
      }
    }
    
    console.log(`  📊 Total coletado: ${todosPrecos.length} preços`);
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