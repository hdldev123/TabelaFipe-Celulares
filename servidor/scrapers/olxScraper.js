import ScraperBase from './scraperBase.js';

class ScraperOLX extends ScraperBase {
  constructor() {
    super('OLX');
    this.baseUrl = 'https://www.olx.com.br';
  }

  async buscarPrecos(termoBusca) {
    const precos = [];
    
    try {
      await this.inicializar();
      
      const termoBuscaFormatado = termoBusca.replace(/\s+/g, '%20');
      const urlBusca = `${this.baseUrl}/busca?q=${termoBuscaFormatado}&c=5020`;
      
      await this.page.goto(urlBusca, { waitUntil: 'networkidle0' });
      
      // Aguarda carregar anúncios
      const temAnuncios = await this.aguardarElemento('[data-lurker_list_id="ListingCard"]');
      if (!temAnuncios) {
        console.log(`  ⚠️  Nenhum anúncio encontrado na OLX para: ${termoBusca}`);
        return precos;
      }
      
      // Extrai dados dos anúncios
      const anuncios = await this.page.$$eval('[data-lurker_list_id="ListingCard"]', (cards) => {
        return cards.slice(0, 20).map(card => {
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
      
      // Processa anúncios válidos
      for (const anuncio of anuncios) {
        if (this.validarAnuncio(anuncio.titulo, termoBusca)) {
          const precoNumerico = this.extrairPrecoTexto(anuncio.preco);
          
          if (precoNumerico && this.validarPreco(precoNumerico)) {
            precos.push({
              valor: precoNumerico,
              fonte: 'OLX',
              urlAnuncio: anuncio.link,
              dataColeta: new Date()
            });
          }
        }
      }
      
      console.log(`  ✅ OLX: ${precos.length} preços coletados`);
      
    } catch (error) {
      console.error(`  ❌ Erro no scraper OLX:`, error);
    } finally {
      await this.finalizar();
    }
    
    return precos;
  }

  validarAnuncio(titulo, termoBusca) {
    const tituloLower = titulo.toLowerCase();
    
    // Deve incluir termos relacionados a celular
    const termosValidos = ['iphone', 'galaxy', 'smartphone', 'celular'];
    const temTermoValido = termosValidos.some(termo => tituloLower.includes(termo));
    
    // Deve conter parte do termo buscado
    const temTermoBusca = termoBusca.split(' ').some(termo => 
      termo.length > 2 && tituloLower.includes(termo.toLowerCase())
    );
    
    // Não deve ser acessório
    const termosProibidos = ['capa', 'película', 'carregador', 'fone', 'cabo'];
    const temTermoProibido = termosProibidos.some(termo => tituloLower.includes(termo));
    
    return temTermoValido && temTermoBusca && !temTermoProibido;
  }
}

export default ScraperOLX;