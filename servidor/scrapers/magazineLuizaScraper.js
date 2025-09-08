import ScraperBase from './scraperBase.js';

class ScraperMagazineLuiza extends ScraperBase {
  constructor() {
    super('Magazine Luiza');
    this.baseUrl = 'https://www.magazineluiza.com.br';
  }

  async buscarPrecos(termoBusca) {
    const precos = [];
    
    try {
      await this.inicializar();
      
      const urlBusca = `${this.baseUrl}/busca/${encodeURIComponent(termoBusca)}`;
      await this.page.goto(urlBusca, { waitUntil: 'networkidle0' });
      
      // Aguarda lista de produtos
      const temProdutos = await this.aguardarElemento('[data-testid="product-list"]');
      if (!temProdutos) {
        console.log(`  ⚠️  Nenhum produto encontrado no Magazine Luiza para: ${termoBusca}`);
        return precos;
      }
      
      // Coleta dados dos produtos
      const produtos = await this.page.$$eval('[data-testid="product-list"] li', (itens) => {
        return itens.slice(0, 15).map(item => {
          const tituloEl = item.querySelector('[data-testid="product-title"]');
          const precoEl = item.querySelector('[data-testid="price-value"]');
          const linkEl = item.querySelector('a');
          
          return {
            titulo: tituloEl ? tituloEl.textContent.trim() : '',
            preco: precoEl ? precoEl.textContent.trim() : '',
            link: linkEl ? linkEl.href : ''
          };
        });
      });
      
      // Filtra e adiciona preços válidos
      for (const produto of produtos) {
        if (this.validarProduto(produto.titulo, termoBusca)) {
          const precoNumerico = this.extrairPrecoTexto(produto.preco);
          
          if (precoNumerico && this.validarPreco(precoNumerico)) {
            precos.push({
              valor: precoNumerico,
              fonte: 'Magazine Luiza',
              urlAnuncio: produto.link,
              dataColeta: new Date()
            });
          }
        }
      }
      
      console.log(`  ✅ Magazine Luiza: ${precos.length} preços coletados`);
      
    } catch (error) {
      console.error(`  ❌ Erro no scraper Magazine Luiza:`, error);
    } finally {
      await this.finalizar();
    }
    
    return precos;
  }

  validarProduto(titulo, termoBusca) {
    return titulo.toLowerCase().includes('smartphone') && 
           termoBusca.split(' ').some(termo => 
             termo.length > 2 && titulo.toLowerCase().includes(termo.toLowerCase())
           );
  }
}

export default ScraperMagazineLuiza;