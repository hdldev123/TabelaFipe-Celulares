import ScraperBase from './scraperBase.js';

class ScraperCasasBahia extends ScraperBase {
  constructor() {
    super('Casas Bahia');
    this.baseUrl = 'https://www.casasbahia.com.br';
  }

  async buscarPrecos(termoBusca) {
    const precos = [];
    
    try {
      await this.inicializar();
      
      const urlBusca = `${this.baseUrl}/busca?q=${encodeURIComponent(termoBusca)}`;
      await this.page.goto(urlBusca, { waitUntil: 'networkidle0' });
      
      // Aguarda carregar os produtos
      const temProdutos = await this.aguardarElemento('[data-testid="product-list"]');
      if (!temProdutos) {
        console.log(`  ⚠️  Nenhum produto encontrado na Casas Bahia para: ${termoBusca}`);
        return precos;
      }
      
      // Extrai informações dos produtos
      const produtos = await this.page.$$eval('[data-testid="product-list"] [data-testid="product-card"]', (cards) => {
        return cards.slice(0, 15).map(card => {
          const tituloEl = card.querySelector('[data-testid="product-title"]');
          const precoEl = card.querySelector('[data-testid="price-current"]');
          const linkEl = card.querySelector('a');
          
          return {
            titulo: tituloEl ? tituloEl.textContent.trim() : '',
            preco: precoEl ? precoEl.textContent.trim() : '',
            link: linkEl ? linkEl.href : ''
          };
        });
      });
      
      // Processa produtos válidos
      for (const produto of produtos) {
        if (this.validarProduto(produto.titulo, termoBusca)) {
          const precoNumerico = this.extrairPrecoTexto(produto.preco);
          
          if (precoNumerico && this.validarPreco(precoNumerico)) {
            precos.push({
              valor: precoNumerico,
              fonte: 'Casas Bahia',
              urlAnuncio: produto.link,
              dataColeta: new Date()
            });
          }
        }
      }
      
      console.log(`  ✅ Casas Bahia: ${precos.length} preços coletados`);
      
    } catch (error) {
      console.error(`  ❌ Erro no scraper Casas Bahia:`, error);
    } finally {
      await this.finalizar();
    }
    
    return precos;
  }

  validarProduto(titulo, termoBusca) {
    const tituloLower = titulo.toLowerCase();
    const termoLower = termoBusca.toLowerCase();
    
    // Deve conter smartphone/celular no título
    const temCelular = tituloLower.includes('smartphone') || 
                      tituloLower.includes('celular') ||
                      tituloLower.includes('iphone') ||
                      tituloLower.includes('galaxy');
    
    // Deve conter termos da busca
    const temTermosBusca = termoLower.split(' ').some(termo => 
      termo.length > 2 && tituloLower.includes(termo)
    );
    
    return temCelular && temTermosBusca;
  }
}

export default ScraperCasasBahia;