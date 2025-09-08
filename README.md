# TabelaFipe-Celulares

Este projeto é uma aplicação web que permite consultar preços de celulares em diferentes lojas online, utilizando scrapers personalizados para cada loja. A interface é desenvolvida em React e o backend em Node.js.

## Funcionalidades
- Consulta de preços de celulares em lojas como Casas Bahia, Magazine Luiza, Mercado Livre, OLX e Trocafone.
- Interface intuitiva para seleção de modelos e visualização dos resultados.
- Scrapers dedicados para cada loja, garantindo dados atualizados.
- Estatísticas e formatação dos resultados.

## Estrutura do Projeto
```
servidor/
  index.js                # Inicialização do servidor Node.js
  modelos/
    celularModel.js       # Modelo de dados para celulares
  rotas/
    index.js              # Rotas da API
  scrapers/               # Scrapers para cada loja
    casasBahiaScraper.js
    magazineLuizaScraper.js
    mercadoLivreScraper.js
    olxScraper.js
    scraperBase.js
    trocafoneScraper.js
  servicos/
    coordenadorScraping.js# Coordenação dos scrapers
  utils/
    estatisticas.js       # Funções utilitárias
src/
  App.tsx                 # Componente principal React
  components/             # Componentes da interface
    Cabecalho/
    Dropdown/
    ResultadoConsulta/
    SeletorCascata/
    TabelaFipe/
  services/
    apiService.ts         # Comunicação com backend
  types/
    tipos.ts              # Tipos TypeScript
  utils/
    formatadores.ts       # Funções de formatação
```

## Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/hdldev123/TabelaFipe-Celulares.git
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Inicie o backend:
   ```sh
   cd servidor
   node index.js
   ```
4. Inicie o frontend:
   ```sh
   npm run dev
   ```

## Tecnologias Utilizadas
- React
- Node.js
- Vite
- JavaScript/TypeScript
- CSS Modules

## Como Contribuir
1. Faça um fork do projeto.
2. Crie uma branch para sua feature:
   ```sh
   git checkout -b minha-feature
   ```
3. Faça suas alterações e envie um pull request.

## Licença
Este projeto está sob a licença MIT.

## Autor
- [hdldev123](https://github.com/hdldev123)
