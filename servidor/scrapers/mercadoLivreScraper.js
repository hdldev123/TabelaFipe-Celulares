import ScraperBase from './scraperBase.js';

class ScraperMercadoLivre extends ScraperBase {
  constructor() {
    super('Mercado Livre');
    this.baseUrl = 'https://lista.mercadolivre.com.br';
  }

  async buscarPrecos(termoBusca, opcoes = {}) {
    const precos = [];
    
    try {
      await this.inicializar();
      
      // Ajustar limites baseado no tipo de consulta
      const tipoConsulta = opcoes.tipo || 'novo';
      this.configurarLimites(tipoConsulta);
      
      // Adicionar filtro para usados se especificado
      let filtroCondicao = '';
      if (tipoConsulta === 'usado') {
        filtroCondicao = '_ITEM*CONDITION_2230581'; // Filtro para usados no ML
      }
      
      // Busca em múltiplas páginas se necessário
      for (let pagina = 1; pagina <= this.maxPaginas; pagina++) {
        console.log(`  📄 Mercado Livre - Página ${pagina}/${this.maxPaginas}`);
        
        const offset = (pagina - 1) * 50; // Mercado Livre usa offset
        let urlBusca = `${this.baseUrl}/${encodeURIComponent(termoBusca)}`;
        
        if (filtroCondicao) {
          urlBusca += `_${filtroCondicao}`;
        }
        
        if (offset > 0) {
          urlBusca += `_Desde_${offset + 1}`;
        }
        
        await this.page.goto(urlBusca, { waitUntil: 'networkidle0' });
        
        // Aguarda carregar os resultados
        const temResultados = await this.aguardarElemento('.ui-search-results');
        if (!temResultados) {
          console.log(`  ⚠️  Nenhum resultado encontrado no Mercado Livre página ${pagina} para: ${termoBusca}`);
          break;
        }
        
        // Extrai preços dos resultados desta página
        const resultados = await this.page.$$eval('.ui-search-result', (elementos) => {
          return elementos.map(el => {
            const tituloEl = el.querySelector('.ui-search-item__title');
            const precoEl = el.querySelector('.price-tag-amount .price-tag-text-color');
            const linkEl = el.querySelector('.ui-search-link');
            const condicaoEl = el.querySelector('.ui-search-item__subtitle');
            
            return {
              titulo: tituloEl ? tituloEl.textContent.trim() : '',
              preco: precoEl ? precoEl.textContent.trim() : '',
              link: linkEl ? linkEl.href : '',
              condicao: condicaoEl ? condicaoEl.textContent.trim() : ''
            };
          });
        });
        
        // Processa e filtra resultados desta página
        let resultadosValidosNestaPagina = 0;
        for (const resultado of resultados) {
          if (this.validarAnuncio(resultado.titulo, termoBusca)) {
            const precoNumerico = this.extrairPrecoTexto(resultado.preco);
            
            if (precoNumerico && this.validarPreco(precoNumerico)) {
              precos.push({
                valor: precoNumerico,
                fonte: 'Mercado Livre',
                urlAnuncio: resultado.link,
                dataColeta: new Date(),
                titulo: resultado.titulo,
                condicao: resultado.condicao
              });
              resultadosValidosNestaPagina++;
              
              // Para quando atingir o limite de anúncios
              if (precos.length >= this.limiteAnuncios) {
                console.log(`  🎯 Mercado Livre: Limite de ${this.limiteAnuncios} anúncios atingido`);
                break;
              }
            }
          }
        }
        
        console.log(`  ✅ Mercado Livre Página ${pagina}: ${resultadosValidosNestaPagina} resultados válidos coletados`);
        
        // Para se já coletou anúncios suficientes ou se não há resultados válidos nesta página
        if (precos.length >= this.limiteAnuncios || resultadosValidosNestaPagina === 0) {
          break;
        }
        
        // Pausa entre páginas
        await this.aguardar(2000);
      }
      
      console.log(`  ✅ Mercado Livre Total: ${precos.length} preços coletados de ${this.maxPaginas} páginas`);
      
    } catch (error) {
      console.error(`  ❌ Erro no scraper Mercado Livre:`, error);
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