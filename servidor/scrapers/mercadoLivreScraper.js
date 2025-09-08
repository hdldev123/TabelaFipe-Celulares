import ScraperBase from './scraperBase.js';

class ScraperMercadoLivre extends ScraperBase {
  constructor() {
    super('Mercado Livre');
    this.baseUrl = 'https://lista.mercadolivre.com.br';
  }

  async buscarPrecos(termoBusca) {
    const precos = [];
    
    try {
      await this.inicializar();
      
      const urlBusca = `${this.baseUrl}/${encodeURIComponent(termoBusca)}`;
      await this.page.goto(urlBusca, { waitUntil: 'networkidle0' });
      
      // Aguarda carregar os resultados
      const temResultados = await this.aguardarElemento('.ui-search-results');
      if (!temResultados) {
        console.log(`  ⚠️  Nenhum resultado encontrado no Mercado Livre para: ${termoBusca}`);
        return precos;
      }
      
      // Extrai preços dos primeiros resultados
      const resultados = await this.page.$$eval('.ui-search-result', (elementos) => {
        return elementos.slice(0, 20).map(el => {
          const tituloEl = el.querySelector('.ui-search-item__title');
          const precoEl = el.querySelector('.price-tag-amount .price-tag-text-color');
          const linkEl = el.querySelector('.ui-search-link');
          
          return {
            titulo: tituloEl ? tituloEl.textContent.trim() : '',
            preco: precoEl ? precoEl.textContent.trim() : '',
            link: linkEl ? linkEl.href : ''
          };
        });
      });
      
      // Processa e filtra resultados
      for (const resultado of resultados) {
        if (this.validarAnuncio(resultado.titulo, termoBusca)) {
          const precoNumerico = this.extrairPrecoTexto(resultado.preco);
          
          if (precoNumerico && this.validarPreco(precoNumerico)) {
            precos.push({
              valor: precoNumerico,
              fonte: 'Mercado Livre',
              urlAnuncio: resultado.link,
              dataColeta: new Date()
            });
          }
        }
      }
      
      console.log(`  ✅ Mercado Livre: ${precos.length} preços coletados`);
      
    } catch (error) {
      console.error(`  ❌ Erro no scraper Mercado Livre:`, error);
    } finally {
      await this.finalizar();
    }
    
    return precos;
  }

  validarAnuncio(titulo, termoBusca) {
    const tituloLower = titulo.toLowerCase();
    const termoLower = termoBusca.toLowerCase();
    
    // Verifica se contém termos do modelo buscado
    const temTermosBusca = termoLower.split(' ').some(termo => 
      termo.length > 2 && tituloLower.includes(termo)
    );
    
    // Descarta anúncios irrelevantes
    const termosProibidos = [
      'capa', 'capinha', 'película', 'carregador', 'fone', 
      'cabo', 'suporte', 'caixa vazia', 'só a caixa'
    ];
    
    const temTermoProibido = termosProibidos.some(termo => 
      tituloLower.includes(termo)
    );
    
    return temTermosBusca && !temTermoProibido;
  }
}

export default ScraperMercadoLivre;