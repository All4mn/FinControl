# FinControl — Documentação do Sistema

**Disciplina:** Projeto Integrador  
**Equipe:** Money Control  
**Repositório:** https://github.com/All4mn/FinControl  

---

## 1. Descrição do Sistema

O FinControl é um sistema web de controle financeiro pessoal. O objetivo é permitir que o usuário registre e acompanhe suas movimentações financeiras — receitas e despesas — organizadas por conta, categoria e método de pagamento.

O sistema foi concebido como uma solução completa, abrangendo as seguintes funcionalidades no escopo final:

- Cadastro e autenticação de usuários (email/senha e Google OAuth)
- Gerenciamento de contas financeiras
- Registro de transações (entradas e saídas), com suporte a arquivamento
- Categorização de gastos
- Gerenciamento de métodos de pagamento
- Dashboard com visualização de saldo e gráficos de gastos
- Tela de relatórios e histórico de transações arquivadas

Na entrega parcial, o backend está completo com todas as rotas e a lógica de negócio, e o frontend contempla as telas de landing page, login e cadastro.

---

## 2. Tecnologias Utilizadas

### Backend
- **Node.js** — ambiente de execução JavaScript no servidor
- **Fastify** — framework web para criação das rotas e gerenciamento das requisições HTTP
- **PostgreSQL** — banco de dados relacional utilizado para persistência dos dados
- **pg** — driver Node.js para conexão com o PostgreSQL, com gerenciamento de pool de conexões
- **dotenv** — carregamento das variáveis de ambiente a partir do arquivo `.env`
- **@fastify/cors** — configuração de CORS para permitir requisições do frontend
- **google-auth-library** — verificação de tokens de autenticação do Google OAuth
- **jsonwebtoken** — suporte a tokens JWT para autenticação

### Frontend
- **React** — biblioteca para construção da interface em componentes reutilizáveis
- **Vite** — ferramenta de build e servidor de desenvolvimento
- **React Router DOM** — gerenciamento de rotas no frontend (SPA)
- **Axios** — cliente HTTP para comunicação com o backend

### Ferramentas e Ambiente
- **DBeaver** — cliente visual para administração do banco PostgreSQL e construção do DER
- **Git + GitHub** — versionamento de código e gerenciamento do projeto via GitHub Projects

---

## 3. Justificativa das Escolhas

**Fastify** foi escolhido no lugar do Express por sua performance superior e suporte nativo a async/await sem configuração adicional. O esquema de plugins e prefixos de rotas facilita a organização modular do backend.

**PostgreSQL** é um banco relacional robusto, com suporte completo a restrições de integridade referencial, transações e tipos de dados avançados — adequado para um sistema financeiro que depende de consistência nos dados.

**React + Vite** combina a componentização do React com a velocidade do Vite no desenvolvimento, especialmente no hot reload. A estrutura de componentes facilita a manutenção e a escalabilidade do frontend.

**Axios** foi escolhido para as requisições HTTP por sua API simples e suporte a interceptors, o que facilita o tratamento centralizado de erros e autenticação futura via tokens.

A separação em **FC_Backend** e **FC_Frontend** segue as boas práticas de projetos fullstack, permitindo que as duas partes evoluam de forma independente com suas próprias dependências e configurações.

--- (mateus: citação ao dbeaver?)

## 4. Estrutura do Projeto

```
FinControl/
├── FC_Backend/
│   ├── src/
│   │   ├── app.js                  # Inicialização do Fastify e registro das rotas
│   │   ├── config/
│   │   │   └── db.js               # Pool de conexão com o PostgreSQL
│   │   ├── controllers/
│   │   │   ├── usuarioController.js
│   │   │   ├── transacaoController.js
│   │   │   ├── categoriaController.js
│   │   │   ├── contaController.js
│   │   │   ├── metodoController.js
│   │   │   └── logsController.js
│   │   ├── models/
│   │   │   ├── usuario.js
│   │   │   ├── transacao.js
│   │   │   ├── categoria.js
│   │   │   ├── conta.js
│   │   │   ├── metodo.js
│   │   │   └── logs.js
│   │   └── routes/
│   │       ├── usuarioRoutes.js
│   │       ├── transacaoRoutes.js
│   │       ├── categoriaRoutes.js
│   │       ├── contaRoutes.js
│   │       ├── metodoRoutes.js
│   │       └── logsRoutes.js
│   ├── .env.exemplo
│   ├── requisicoes.http
│   └── package.json
│
└── FC_Frontend/
    ├── src/
    │   ├── App.jsx                 # Definição das rotas do frontend
    │   ├── main.jsx
    │   └── components/
    │       ├── landingpage/
    │       ├── login/
    │       ├── cadastro/
    │       └── componentesPadrao/  # Header e Footer reutilizáveis
    ├── index.html
    └── package.json
```

---

## 5. Guia de Configuração e Execução

### Pré-requisitos

- Node.js (v18 ou superior)
- PostgreSQL instalado e em execução
- Git

### 1. Clonar o repositório

```bash
git clone https://github.com/All4mn/FinControl.git
cd FinControl
```

### 2. Configurar o banco de dados

No DBeaver ou outro cliente PostgreSQL:

1. Crie um banco de dados (ex: `fincontrol`) (mateus: ???)
2. Execute `Documentação/scripts/criar_tabelas.sql`
3. Execute `Documentação/scripts/popular_dados.sql`
4. Anote a string de conexão no formato:
   ```
   postgresql://usuario:senha@localhost:5432/fincontrol
   ```

### 3. Configurar o backend

```bash
cd FC_Backend
cp .env.exemplo .env
```

Edite o `.env`:

```env
DB_CONNECTION_STRING='postgresql://usuario:senha@localhost:5432/fincontrol' (mateus: nao seria a do banco de dados nas nuvens ja?)
GOOGLE_CLIENT_ID='seu_client_id_do_google' (mateus: nao seria o google client id do allan? ja que ele que configurou a funcionalidade?)
```

```bash
npm install 
npm run dev 
```

Backend disponível em `http://localhost:3000`.

### 4. Configurar o frontend

```bash
cd ../FC_Frontend
npm install 
npm run dev
```

Frontend disponível em `http://localhost:5173` (ou porta indicada pelo Vite).

### 5. Verificar o funcionamento

Acesse `http://localhost:5173`. Para testar as rotas da API diretamente, use o arquivo `FC_Backend/requisicoes.http` com a extensão REST Client no VS Code.
