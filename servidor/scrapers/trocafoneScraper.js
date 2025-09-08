import ScraperBase from './scraperBase.js';

class ScraperTrocafone extends ScraperBase {
  constructor() {
    super('Trocafone');
    this.baseUrl = 'https://www.trocafone.com';
  }

  async buscarPrecos(termoBusca) {
    const precos = [];
    
    try {
      await this.inicializar();
      
      const urlBusca = `${this.baseUrl}/busca?q=${encodeURIComponent(termoBusca)}`;
      await this.page.goto(urlBusca, { waitUntil: 'networkidle0' });
      
      // Aguarda produtos carregarem
      const temProdutos = await this.aguardarElemento('.product-list');
      if (!temProdutos) {
        console.log(`  ⚠️  Nenhum produto encontrado na Trocafone para: ${termoBusca}`);
        return precos;
      }
      
      // Coleta informações dos produtos
      const produtos = await this.page.$$eval('.product-item', (itens) => {
        return itens.slice(0, 15).map(item => {
          const tituloEl = item.querySelector('.product-title');
          const precoEl = item.querySelector('.price');
          const linkEl = item.querySelector('a');
          
          return {
            titulo: tituloEl ? tituloEl.textContent.trim() : '',
            preco: precoEl ? precoEl.textContent.trim() : '',
            link: linkEl ? linkEl.href : ''
          };
        });
      });
      
      // Adiciona preços válidos
      for (const produto of produtos) {
        if (this.validarProduto(produto.titulo, termoBusca)) {
          const precoNumerico = this.extrairPrecoTexto(produto.preco);
          
          if (precoNumerico && this.validarPreco(precoNumerico)) {
            precos.push({
              valor: precoNumerico,
              fonte: 'Trocafone',
              urlAnuncio: produto.link,
              dataColeta: new Date()
            });
          }
        }
      }
      
      console.log(`  ✅ Trocafone: ${precos.length} preços coletados`);
      
    } catch (error) {
      console.error(`  ❌ Erro no scraper Trocafone:`, error);
    } finally {
      await this.finalizar();
    }
    
    return precos;
  }

  validarProduto(titulo, termoBusca) {
    const tituloLower = titulo.toLowerCase();
    
    return termoBusca.split(' ').some(termo => 
      termo.length > 2 && tituloLower.includes(termo.toLowerCase())
    );
  }
}

export default ScraperTrocafone;