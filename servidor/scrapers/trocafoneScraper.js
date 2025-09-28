import ScraperBase from './scraperBase.js';

class ScraperTrocafone extends ScraperBase {
  constructor() {
    super('Trocafone');
    this.baseUrl = 'https://www.trocafone.com';
    // Trocafone é especializada em usados, então configuramos mais anúncios
    this.configurarLimites('usado');
  }

  async buscarPrecos(termoBusca, opcoes = {}) {
    const precos = [];
    
    try {
      await this.inicializar();
      
      // Busca em múltiplas páginas para obter mais anúncios
      for (let pagina = 1; pagina <= this.maxPaginas; pagina++) {
        console.log(`  📄 Trocafone - Página ${pagina}/${this.maxPaginas}`);
        
        const urlBusca = `${this.baseUrl}/busca?q=${encodeURIComponent(termoBusca)}&page=${pagina}`;
        await this.page.goto(urlBusca, { waitUntil: 'networkidle0' });
        
        // Aguarda produtos carregarem
        const temProdutos = await this.aguardarElemento('.product-list, .products-grid, .search-results');
        if (!temProdutos) {
          console.log(`  ⚠️  Nenhum produto encontrado na Trocafone página ${pagina} para: ${termoBusca}`);
          break;
        }
        
        // Coleta informações dos produtos desta página
        const produtos = await this.page.$$eval('.product-item, .product-card, .search-result-item', (itens) => {
          return itens.map(item => {
            const tituloEl = item.querySelector('.product-title, .product-name, h3, h4');
            const precoEl = item.querySelector('.price, .product-price, .price-current');
            const linkEl = item.querySelector('a');
            const estadoEl = item.querySelector('.condition, .product-condition, .state');
            
            return {
              titulo: tituloEl ? tituloEl.textContent.trim() : '',
              preco: precoEl ? precoEl.textContent.trim() : '',
              link: linkEl ? linkEl.href : '',
              estado: estadoEl ? estadoEl.textContent.trim() : ''
            };
          });
        });
        
        // Adiciona preços válidos desta página
        let produtosValidosNestaPagina = 0;
        for (const produto of produtos) {
          if (this.validarProduto(produto.titulo, termoBusca)) {
            const precoNumerico = this.extrairPrecoTexto(produto.preco);
            
            if (precoNumerico && this.validarPreco(precoNumerico)) {
              precos.push({
                valor: precoNumerico,
                fonte: 'Trocafone',
                urlAnuncio: produto.link,
                dataColeta: new Date(),
                titulo: produto.titulo,
                estado: produto.estado
              });
              produtosValidosNestaPagina++;
              
              // Para quando atingir o limite de anúncios
              if (precos.length >= this.limiteAnuncios) {
                console.log(`  🎯 Trocafone: Limite de ${this.limiteAnuncios} produtos atingido`);
                break;
              }
            }
          }
        }
        
        console.log(`  ✅ Trocafone Página ${pagina}: ${produtosValidosNestaPagina} produtos válidos coletados`);
        
        // Para se já coletou produtos suficientes ou se não há produtos válidos nesta página
        if (precos.length >= this.limiteAnuncios || produtosValidosNestaPagina === 0) {
          break;
        }
        
        // Pausa entre páginas
        await this.aguardar(2000);
      }
      
      console.log(`  ✅ Trocafone Total: ${precos.length} preços coletados de ${this.maxPaginas} páginas`);
      
    } catch (error) {
      console.error(`  ❌ Erro no scraper Trocafone:`, error);
    } finally {
      await this.finalizar();
    }
    
    return precos;
  }

  async aguardar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  validarProduto(titulo, termoBusca) {
    const tituloLower = titulo.toLowerCase();
    
    return termoBusca.split(' ').some(termo => 
      termo.length > 2 && tituloLower.includes(termo.toLowerCase())
    );
  }
}

export default ScraperTrocafone;