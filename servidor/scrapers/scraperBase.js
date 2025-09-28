import puppeteer from 'puppeteer';

class ScraperBase {
  constructor(nome) {
    this.nome = nome;
    this.browser = null;
    this.page = null;
    this.limiteAnuncios = 20; // Padrão para scrapers de produtos novos
    this.maxPaginas = 1; // Padrão uma página
  }

  async inicializar() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    this.page = await this.browser.newPage();
    
    // Configurações para evitar detecção
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    await this.page.setViewport({ width: 1366, height: 768 });
  }

  async finalizar() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async buscarPrecos(termoBusca, opcoes = {}) {
    throw new Error('Método buscarPrecos deve ser implementado pela classe filha');
  }

  // Método para configurar limites baseado no tipo de produto
  configurarLimites(tipoConsulta = 'novo') {
    if (tipoConsulta === 'usado') {
      this.limiteAnuncios = 50; // Mais anúncios para usados
      this.maxPaginas = 3; // Até 3 páginas para usados
    } else {
      this.limiteAnuncios = 20; // Padrão para novos
      this.maxPaginas = 1; // Uma página para novos
    }
  }

  validarPreco(preco) {
    const precoNumerico = parseFloat(preco.toString().replace(/[^\d,]/g, '').replace(',', '.'));
    
    // Filtra preços muito baixos (provavelmente capas, películas) ou muito altos (outliers)
    return precoNumerico >= 100 && precoNumerico <= 15000;
  }

  extrairPrecoTexto(texto) {
    const match = texto.match(/R\$\s*([\d.,]+)/);
    if (match) {
      return parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
    }
    return null;
  }

  async aguardarElemento(seletor, timeout = 5000) {
    try {
      await this.page.waitForSelector(seletor, { timeout });
      return true;
    } catch {
      return false;
    }
  }
}

export default ScraperBase;