import ScraperBase from './scraperBase.js';

class ScraperOLX extends ScraperBase {
  constructor() {
    super('OLX');
    this.baseUrl = 'https://www.olx.com.br';
    // OLX é principalmente para usados, então configuramos mais anúncios
    this.configurarLimites('usado');
  }

  async buscarPrecos(termoBusca, opcoes = {}) {
    const precos = [];
    
    try {
      await this.inicializar();
      
      const termoBuscaFormatado = termoBusca.replace(/\s+/g, '%20');
      
      // Busca em múltiplas páginas para obter mais anúncios
      for (let pagina = 1; pagina <= this.maxPaginas; pagina++) {
        console.log(`  📄 OLX - Página ${pagina}/${this.maxPaginas}`);
        
        const urlBusca = `${this.baseUrl}/busca?q=${termoBuscaFormatado}&c=5020&o=${pagina}`;
        
        await this.page.goto(urlBusca, { waitUntil: 'networkidle0' });
        
        // Aguarda carregar anúncios
        const temAnuncios = await this.aguardarElemento('[data-lurker_list_id="ListingCard"]');
        if (!temAnuncios) {
          console.log(`  ⚠️  Nenhum anúncio encontrado na OLX página ${pagina} para: ${termoBusca}`);
          break; // Para se não houver mais anúncios
        }
        
        // Extrai dados dos anúncios desta página
        const anuncios = await this.page.$$eval('[data-lurker_list_id="ListingCard"]', (cards) => {
          return cards.map(card => {
            const tituloEl = card.querySelector('[data-lurker_list_id="ad_title"]');
            const precoEl = card.querySelector('[data-lurker_list_id="ad_price"]');
            const linkEl = card.querySelector('a');
            
            return {
              titulo: tituloEl ? tituloEl.textContent.trim() : '',
              preco: precoEl ? precoEl.textContent.trim() : '',
              link: linkEl ? linkEl.href : ''
            };
          });
        });
        
        // Processa anúncios válidos desta página
        let anunciosValidosNestaPagina = 0;
        for (const anuncio of anuncios) {
          if (this.validarAnuncio(anuncio.titulo, termoBusca)) {
            const precoNumerico = this.extrairPrecoTexto(anuncio.preco);
            
            if (precoNumerico && this.validarPreco(precoNumerico)) {
              precos.push({
                valor: precoNumerico,
                fonte: 'OLX',
                urlAnuncio: anuncio.link,
                dataColeta: new Date(),
                titulo: anuncio.titulo
              });
              anunciosValidosNestaPagina++;
              
              // Para quando atingir o limite de anúncios
              if (precos.length >= this.limiteAnuncios) {
                console.log(`  🎯 OLX: Limite de ${this.limiteAnuncios} anúncios atingido`);
                break;
              }
            }
          }
        }
        
        console.log(`  ✅ OLX Página ${pagina}: ${anunciosValidosNestaPagina} anúncios válidos coletados`);
        
        // Para se já coletou anúncios suficientes ou se não há anúncios válidos nesta página
        if (precos.length >= this.limiteAnuncios || anunciosValidosNestaPagina === 0) {
          break;
        }
        
        // Pausa entre páginas para não sobrecarregar o servidor
        await this.aguardar(2000);
      }
      
      console.log(`  ✅ OLX Total: ${precos.length} preços coletados de ${this.maxPaginas} páginas`);
      
    } catch (error) {
      console.error(`  ❌ Erro no scraper OLX:`, error);
    } finally {
      await this.finalizar();
    }
    
    return precos;
  }

  async aguardar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  validarAnuncio(titulo, termoBusca) {
    const tituloLower = titulo.toLowerCase();
    const termoBuscaLower = termoBusca.toLowerCase();
    
    // Deve incluir termos relacionados a celular/smartphone
    const termosValidos = [
      'iphone', 'galaxy', 'smartphone', 'celular', 'phone', 'mobile',
      'xiaomi', 'samsung', 'apple', 'motorola', 'lg', 'huawei', 'oneplus'
    ];
    const temTermoValido = termosValidos.some(termo => tituloLower.includes(termo));
    
    // Deve conter pelo menos 60% dos termos importantes da busca
    const termosBusca = termoBuscaLower.split(' ').filter(termo => termo.length > 2);
    const termosEncontrados = termosBusca.filter(termo => tituloLower.includes(termo));
    const percentualMatch = termosEncontrados.length / termosBusca.length;
    
    // Não deve ser acessório ou produto irrelevante
    const termosProibidos = [
      'capa', 'capinha', 'película', 'carregador', 'fone', 'cabo', 'suporte',
      'caixa vazia', 'só a caixa', 'pelicula', 'película', 'vidro temperado',
      'adaptador', 'transformador', 'bateria', 'tela quebrada', 'sucata',
      'para retirada de peças', 'não liga', 'placa mãe', 'defeito'
    ];
    const temTermoProibido = termosProibidos.some(termo => tituloLower.includes(termo));
    
    // Pontuação adicional para títulos mais específicos
    let pontuacao = 0;
    if (temTermoValido) pontuacao += 30;
    if (percentualMatch >= 0.6) pontuacao += 40;
    if (!temTermoProibido) pontuacao += 30;
    
    // Bonus para títulos que incluem informações técnicas (GB, memoria, etc)
    if (tituloLower.match(/\d+gb|\d+tb|memoria|ram|storage/)) pontuacao += 10;
    
    return pontuacao >= 70;
  }
}

export default ScraperOLX;