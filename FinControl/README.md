# 💰 FinControl — Controle Financeiro Pessoal

Sistema fullstack de controle financeiro pessoal com Node.js, Express, PostgreSQL (Neon) e React + Vite.

---

## 🏗️ Estrutura do Projeto

```
FinControl/
├── backend/
│   ├── server/index.js          # Ponto de entrada do servidor
│   ├── routes/                  # Definição de rotas
│   ├── controllers/             # Regras de negócio
│   ├── models/                  # Queries SQL
│   ├── config/
│   │   ├── database.js          # Conexão com Neon (SSL)
│   │   └── schema.sql           # DDL para criar tabelas
│   ├── .env                     # Variáveis de ambiente (não commitar!)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/               # Login, Cadastro, Dashboard, NovaTransação
    │   ├── services/api.js      # Axios + serviços por recurso
    │   ├── hooks/useAuth.js     # Hook de autenticação
    │   └── App.jsx              # Roteamento simples
    └── package.json
```

---

## 🚀 Como executar

### 1. Criar as tabelas no banco (apenas uma vez)

Acesse o **Neon Console** → SQL Editor e execute o conteúdo de:
```
backend/config/schema.sql
```

### 2. Backend

```bash
cd backend
npm run dev        # Desenvolvimento com nodemon (porta 3000)
# ou
npm start          # Produção
```

### 3. Frontend

```bash
cd frontend
npm run dev        # Vite (porta 5173)
```

---

## 🔗 Rotas da API

| Método | Rota                    | Descrição                  |
|--------|-------------------------|----------------------------|
| POST   | /auth/registro          | Criar conta                |
| POST   | /auth/login             | Autenticar usuário         |
| GET    | /usuarios               | Listar usuários            |
| GET    | /contas                 | Listar contas              |
| POST   | /contas                 | Criar conta                |
| GET    | /transacoes             | Listar transações          |
| GET    | /transacoes/resumo      | Resumo financeiro          |
| POST   | /transacoes             | Criar transação            |
| GET    | /categorias             | Listar categorias          |
| GET    | /metodos                | Listar métodos             |

---

## 🌐 Banco de Dados (Neon)

- **Host:** ep-purple-rice-amji35uy-pooler.c-5.us-east-1.aws.neon.tech
- **Banco:** neondb
- **SSL:** ativado (rejectUnauthorized: false)
- Conexão via `pg.Pool` — configurada em `backend/config/database.js`

---

## 📦 Dependências

### Backend
- `express` — framework HTTP
- `pg` — cliente PostgreSQL
- `dotenv` — variáveis de ambiente
- `cors` — controle de origem
- `nodemon` — recarregamento automático (dev)

### Frontend
- `react` + `vite` — framework e bundler
- `axios` — requisições HTTP

---

## ⚠️ Próximos passos

- [ ] Implementar JWT completo (`jsonwebtoken`)
- [ ] Adicionar bcrypt para hash de senhas
- [ ] Implementar middleware de autenticação
- [ ] Adicionar React Router DOM para navegação
- [ ] Criar componentes reutilizáveis
- [ ] Configurar variáveis de ambiente no servidor de produção

---

> Gerado automaticamente por `setup.sh` — FinControl v1.0.0
