# 🚀 Guia Completo de Hospedagem - TabelaFipe-Celulares

Este guia contém todas as instruções para hospedar o frontend e backend do projeto TabelaFipe-Celulares.

## 📋 Pré-requisitos

- Conta no GitHub (já tem)
- Conta no MongoDB Atlas (já configurado)
- Contas nos serviços de hospedagem escolhidos

## 🎯 Estratégia de Hospedagem Recomendada

### **Backend (API)**: Render.com (GRATUITO)
- ✅ Suporte completo ao Node.js
- ✅ Variáveis de ambiente seguras
- ✅ Auto-deploy do GitHub
- ✅ Ideal para APIs com MongoDB

### **Frontend**: Vercel.com (GRATUITO)
- ✅ Otimizado para React/Vite
- ✅ Deploy automático do GitHub
- ✅ CDN global
- ✅ Domínio personalizado

---

## 🔧 PASSO 1: Preparar o Repositório

### 1.1 Commit e Push das Alterações
```bash
git add .
git commit -m "feat: configurações para produção e hospedagem"
git push origin master
```

### 1.2 Verificar Estrutura dos Arquivos
Certifique-se que estes arquivos foram criados:
- ✅ `servidor/.env` (já existe)
- ✅ `servidor/package.json` (novo)
- ✅ `vercel.json` (novo)
- ✅ `netlify.toml` (novo)
- ✅ `render.yaml` (novo)
- ✅ `.env.example` (novo)

---

## 🖥️ PASSO 2: Hospedar o Backend (Render.com)

### 2.1 Criar Conta no Render
1. Acesse [render.com](https://render.com)
2. Faça login com sua conta GitHub
3. Autorize o Render a acessar seus repositórios

### 2.2 Criar Novo Web Service
1. Click em **"New +"** → **"Web Service"**
2. Conecte seu repositório `TabelaFipe-Celulares`
3. Configure o serviço:

**Configurações Básicas:**
```
Name: tabela-fipe-celulares-api
Region: Oregon (US West)
Branch: master
Runtime: Node
```

**Comandos de Build:**
```
Build Command: cd servidor && npm install
Start Command: cd servidor && npm start
```

### 2.3 Configurar Variáveis de Ambiente
Na seção **Environment Variables**, adicione:

```
NODE_ENV = production
MONGODB_URI = mongodb+srv://fipe_admin:admin123@fipe-teste.wtgaly0.mongodb.net/?retryWrites=true&w=majority&appName=fipe-teste
FRONTEND_URL = https://tabela-fipe-celulares.vercel.app
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true
```

### 2.4 Deploy
1. Click em **"Create Web Service"**
2. Aguarde o build e deploy (5-10 minutos)
3. Anote a URL gerada (ex: `https://tabela-fipe-celulares-api.onrender.com`)

---

## 🌐 PASSO 3: Hospedar o Frontend (Vercel.com)

### 3.1 Criar Conta na Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub

### 3.2 Importar Projeto
1. Click em **"New Project"**
2. Selecione o repositório `TabelaFipe-Celulares`
3. Click em **"Import"**

### 3.3 Configurar Build
**Framework Preset:** Vite
**Root Directory:** `./` (raiz)
**Build Command:** `npm run build`
**Output Directory:** `dist`

### 3.4 Configurar Variável de Ambiente
Na seção **Environment Variables**, adicione:
```
VITE_API_URL = https://sua-url-do-render.onrender.com/api
```
*(Substitua pela URL real do seu backend no Render)*

### 3.5 Deploy
1. Click em **"Deploy"**
2. Aguarde o build (2-3 minutos)
3. Anote a URL gerada (ex: `https://tabela-fipe-celulares.vercel.app`)

---

## 🔄 PASSO 4: Configurar CORS no Backend

### 4.1 Atualizar URL do Frontend no Render
1. Volte ao painel do Render
2. Vá em **Environment Variables**
3. Atualize a variável `FRONTEND_URL` com a URL real da Vercel:
```
FRONTEND_URL = https://sua-url-real.vercel.app
```
4. Click em **"Save Changes"**
5. O serviço será automaticamente re-deploylado

---

## ✅ PASSO 5: Teste Final

### 5.1 Testar Backend
Acesse: `https://sua-api.onrender.com/health`
Deve retornar: `{"status":"OK","timestamp":"..."}`

### 5.2 Testar Frontend
1. Acesse sua URL da Vercel
2. Teste a busca por anos, marcas e modelos
3. Verifique se os preços são carregados corretamente

### 5.3 Verificar Logs (se houver erro)
**Render (Backend):**
- Vá em **Logs** no painel do serviço

**Vercel (Frontend):**
- Vá em **Functions** → **View Logs**

---

## 🔧 URLs de Exemplo (Substitua pelas suas)

```env
# Backend (Render)
https://tabela-fipe-celulares-api.onrender.com

# Frontend (Vercel) 
https://tabela-fipe-celulares.vercel.app

# API Endpoints de teste:
GET https://tabela-fipe-celulares-api.onrender.com/health
GET https://tabela-fipe-celulares-api.onrender.com/api/anos
```

---

## 🆘 Solução de Problemas Comuns

### Backend não inicia
- Verifique logs no Render
- Confirme se MONGODB_URI está correto
- Verifique se as dependências foram instaladas

### Frontend não conecta com Backend
- Verifique se VITE_API_URL está correta
- Confirme se CORS está configurado no backend
- Teste a API diretamente no navegador

### Erro de Build
- Verifique se todas as dependências estão no package.json
- Confirme se os comandos de build estão corretos
- Veja os logs de build nos painéis

---

## 🎉 Pronto!

Seu projeto agora está rodando em produção com:
- ✅ Backend hospedado no Render
- ✅ Frontend hospedado na Vercel  
- ✅ Banco MongoDB Atlas
- ✅ HTTPS automático
- ✅ Deploy contínuo do GitHub

**Próximos passos opcionais:**
- Configurar domínio personalizado
- Adicionar monitoramento
- Configurar alertas de uptime