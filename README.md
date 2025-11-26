# FreteMaster MVP

Sistema de cálculo de frete com múltiplas transportadoras.

## 🚀 Quick Start

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local)

### Iniciar o projeto

```bash
# Clonar e entrar no diretório
cd calculo-frete

# Iniciar todos os serviços
docker-compose up

# Ou em background
docker-compose up -d
```

### Acessar os serviços

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/ping
- **Database**: localhost:5432

## 📁 Estrutura do Projeto

```
calculo-frete/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── app.js          # Aplicação principal
│   │   ├── config/         # Configurações (DB, etc)
│   │   ├── controllers/    # Controladores
│   │   ├── middleware/     # Middlewares (auth, etc)
│   │   ├── models/         # Models Sequelize
│   │   ├── routes/         # Rotas da API
│   │   └── services/       # Serviços (transportadoras)
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── frontend/               # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas (Login, Dashboard)
│   │   ├── services/      # API clients
│   │   ├── hooks/         # Custom hooks
│   │   └── styles/        # Estilos globais
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml      # Orquestração dos serviços
```

## 🛠️ Desenvolvimento Local

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📦 Transportadoras Integradas (MVP)

- ✅ Correios
- ✅ Jadlog
- ✅ Braspress
- ✅ Expresso São Miguel

## 🔐 Variáveis de Ambiente

Copie `.env.example` para `.env` e ajuste conforme necessário:

```env
PORT=4000
DB_HOST=postgres
DB_USER=fretemaster
DB_PASS=fretemaster_pass
DB_NAME=fretemaster
JWT_SECRET=your_secret_here
```

## 📝 API Endpoints

### Health Check
- `GET /ping` - Verifica se a API está ativa
- `GET /health` - Status completo (API + DB)

## 🎯 Próximos Passos

1. Implementar autenticação JWT completa
2. Criar rotas de cálculo de frete
3. Integrar APIs reais das transportadoras
4. Implementar histórico de cotações
5. Adicionar testes automatizados

## 📄 Licença

MIT
