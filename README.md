# TabelaFipe-Celulares

Aplicação web para consulta de preços de celulares em diferentes lojas online, similar à Tabela FIPE para automóveis. A interface é desenvolvida em React/TypeScript e o backend em Node.js com MongoDB.

## Funcionalidades
- Consulta de preços de celulares em lojas como Casas Bahia, Magazine Luiza, Mercado Livre, OLX e Trocafone.
- Interface intuitiva para seleção de modelos e visualização dos resultados.
- Scrapers dedicados para cada loja, garantindo dados atualizados.
- Estatísticas e formatação dos resultados.
- Banco de dados MongoDB para armazenamento dos dados coletados.

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
    seedDatabase.js       # Script para popular o banco
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

## Instalação e Execução

### Pré-requisitos
- Node.js
- MongoDB Atlas (ou MongoDB local)

### Configuração
1. Clone o repositório:
   ```sh
   git clone https://github.com/hdldev123/TabelaFipe-Celulares.git
   cd TabelaFipe-Celulares
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Configure o arquivo `.env` no diretório `servidor/`:
   ```
   MONGODB_URI=sua_string_conexao_mongodb
   PORTA_SERVIDOR=5001
   NODE_ENV=development
   ```
4. Popule o banco de dados com dados iniciais:
   ```sh
   node servidor/utils/seedDatabase.js
   ```

### Execução
1. Inicie o backend:
   ```sh
   cd servidor
   node index.js
   ```
2. Inicie o frontend:
   ```sh
   npm run dev
   ```
3. Acesse a aplicação em `http://localhost:5173`

## Tecnologias Utilizadas

### Frontend
- React
- TypeScript
- CSS Modules
- Vite

### Backend
- Node.js
- Express
- MongoDB
- Puppeteer (para web scraping)

## API Endpoints

- `GET /api/anos` - Retorna anos disponíveis
- `GET /api/marcas?ano=[ano]` - Retorna marcas do ano selecionado
- `GET /api/modelos?marca=[marca]&ano=[ano]` - Retorna modelos
- `GET /api/precos/:idModelo` - Retorna preços do modelo
- `GET /api/debug/celulares` - Lista todos os celulares (endpoint de teste)

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
