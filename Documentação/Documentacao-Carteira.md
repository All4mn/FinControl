# FinControl — Documentação da Funcionalidade Carteira

## 1. Visão Geral da Funcionalidade

A funcionalidade **Carteira** permite que o usuário crie e gerencie agrupamentos de contas financeiras dentro do sistema. Uma carteira é um recurso de apoio que serve para organizar várias contas em um só lugar e facilitar a visualização de saldo ou agrupamentos personalizados.

Esta funcionalidade foi implementada como parte do escopo do 2º bimestre, atendendo ao requisito de CRUD completo para uma tabela secundária do modelo de dados.

## 2. Objetivo da Carteira

- Implementar o cadastro de carteiras pelo usuário.
- Permitir exibir apenas as carteiras do usuário logado.
- Garantir operações de leitura, atualização e exclusão de carteiras.
- Separar claramente backend e frontend conforme arquitetura do projeto.

## 3. Modelagem de Dados

A entidade `carteira` é uma tabela de apoio ao sistema financeiro. Ela está relacionada a `usuario` e a `conta` por meio de uma tabela associativa `carteira_has_conta`.

### Estrutura da tabela `carteira`

| Coluna | Tipo | Restrição | Descrição |
|---|---|---|---|
| `id_carteira` | `SERIAL` | PK | Identificador único da carteira |
| `id_usuario` | `INT` | FK → `usuario`, NOT NULL | Usuário proprietário da carteira |
| `nome_carteira` | `VARCHAR(100)` | NOT NULL | Nome da carteira |

### Relacionamentos principais

- `carteira.id_usuario` → `usuario.id_usuario`
- `carteira_has_conta.id_carteira` → `carteira.id_carteira`
- `carteira_has_conta.id_conta` → `conta.id_conta`

A carteira funciona como um agrupador lógico de contas, mas os lançamentos financeiros continuam associados à conta e à transação.

## 4. Backend

A implementação no backend segue o padrão de camadas do projeto: controller → service → repository.

### 4.1 Rotas

As rotas da funcionalidade carteira estão definidas em `src/features/carteira/carteiraRoutes.js`.

Todos os endpoints de carteira exigem autenticação via cookie de sessão. O servidor valida o token do usuário antes de consultar ou alterar qualquer carteira.

Endpoints implementados:

- `GET /carteiras` — lista apenas as carteiras do usuário autenticado
- `GET /carteiras/usuario/:id_usuario` — lista apenas as carteiras do usuário informado; o backend valida que o ID informado pertence ao usuário logado
- `GET /carteiras/:id` — busca carteira por ID, somente se pertencer ao usuário autenticado
- `POST /carteiras` — cria uma nova carteira para o usuário autenticado
- `PUT /carteiras/:id` — atualiza o nome da carteira, somente se pertencer ao usuário autenticado
- `DELETE /carteiras/:id` — exclui a carteira, somente se pertencer ao usuário autenticado

> Observação: não há caso de uso legítimo para um endpoint público que retorne carteiras de outros usuários. Todas as rotas de carteira são protegidas e validadas por propriedade do recurso.

### 4.2 Controller

O controlador `src/features/carteira/carteira.controller.js` gerencia as requisições HTTP e delega a lógica para o serviço.

A nova rota `listarPorUsuario` garante que apenas carteiras pertencentes ao usuário logado sejam retornadas, usando o parâmetro `id_usuario`.

### 4.3 Serviço

O serviço `src/features/carteira/carteira.service.js` contém a lógica de negócio intermediária.

O método `findByUsuario(id_usuario)` valida o parâmetro e chama o repository adequado.

### 4.4 Repositório

O repository `src/features/carteira/carteira.repository.js` executa as consultas SQL diretamente no banco.

A query-chave implementada foi:

```sql
SELECT * FROM carteira WHERE id_usuario = $1 ORDER BY id_carteira DESC
```

Isso garante que a listagem seja filtrada por usuário e entregue resultados ordenados pelo ID.

## 5. Frontend

A interface do frontend foi implementada mantendo o padrão visual e estrutural do projeto React + Vite.

### 5.1 Página de Carteira

A página principal está em `src/pages/carteira/Carteira.jsx` e contém:

- Título e contexto de usuário
- Formulário de criação/edição de carteira
- Tabela de listagem das carteiras existentes
- Mensagens de sucesso ou erro

### 5.2 Hook customizado

O arquivo `src/pages/carteira/useCarteira.js` centraliza a lógica do frontend:

- busca de carteiras
- criação de nova carteira
- atualização de carteira
- exclusão de carteira

O hook utiliza o endpoint específico do usuário:

```js
GET `${API_BASE_URL}/carteiras/usuario/${usuario.id_usuario}`
```

Isso tornou a listagem corretamente dependente do usuário autenticado.

### 5.3 Componentes reutilizáveis

Foram criados componentes de formulário e tabela seguindo o padrão do projeto, mantendo o estilo e a organização já existentes:

- `src/components/componentesPadrao/formCarteira/FormCarteira.jsx`
- `src/components/componentesPadrao/tableCarteira/TableCarteira.jsx`

## 6. Integração com o fluxo do projeto

A carteira é uma entidade de apoio que atende ao requisito de CRUD de tabelas secundárias do 2º bimestre, sem mexer na tabela nuclear `transacao` como entidade central.

A implementação foi feita pensando em:

- separação clara entre backend e frontend
- rotas REST específicas
- manipulação de dados do usuário logado
- reutilização de componentes e hooks do frontend

## 7. Tecnologias específicas usadas na carteira

- Backend: Node.js, Fastify, PostgreSQL, `pg`
- Frontend: React, Vite, Axios
- Estilo: componentes CSS modularizados
- Arquitetura: controller → service → repository

## 8. Como testar a carteira

1. Subir o backend com `npm run dev` em `FC_Backend_VS`.
2. Subir o frontend com `npm run dev` em `FC_Frontend`.
3. Fazer login com um usuário válido.
4. Acessar a página de carteira e criar uma nova carteira.
5. Confirmar que a nova carteira aparece apenas na listagem do usuário autenticado.

## 9. Observações finais

A carteira ainda não implementa um console visual de saldo consolidado, mas já possui o CRUD completo esperado para seu ciclo básico de uso. O próximo passo natural é integrar a carteira ao dashboard de saldos e ao fluxo de transações.
