# FinControl — Documentação do Banco de Dados

**Disciplina:** Projeto Integrador  
**Equipe:** Money Control  
**SGBD:** PostgreSQL (hospedado no Neon)  
**Ferramenta de modelagem:** DBeaver

---

## 1. Visão Geral

O banco de dados do FinControl é responsável por armazenar todas as informações do sistema de controle financeiro: usuários, suas contas bancárias, carteiras, transações financeiras, categorias de gastos, métodos de pagamento e logs de auditoria.

O modelo foi projetado seguindo os princípios de normalização relacional, com chaves estrangeiras para garantir integridade referencial e uso de `ON DELETE CASCADE` ou `ON DELETE SET NULL` conforme a criticidade de cada relacionamento.

---

## 2. Diagrama Entidade-Relacionamento (DER)

![DER do FinControl](./neondb_-_neondb_-_public.png)

> Notação utilizada: conectores do DBeaver (equivalente a Crow's Foot). O arquivo de projeto do DBeaver está disponível em `General-20260510.dbp`.

---

## 3. Descrição das Tabelas

### 3.1 `usuario`

Armazena os dados de cadastro dos usuários do sistema. Suporta tanto cadastro tradicional (email + senha) quanto login via Google OAuth, sendo os campos `senha_usuario` e `google_id_usuario` mutuamente opcionais dependendo do método de autenticação.

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id_usuario` | `SERIAL` | PK | Identificador único do usuário |
| `nome_usuario` | `VARCHAR(100)` | NOT NULL | Nome completo |
| `email_usuario` | `VARCHAR(150)` | NOT NULL, UNIQUE | E-mail de acesso |
| `senha_usuario` | `VARCHAR(255)` | — | Senha (texto simples na versão atual) |
| `telefone_usuario` | `VARCHAR(20)` | — | Telefone de contato |
| `google_id_usuario` | `VARCHAR(255)` | UNIQUE | ID do Google para autenticação OAuth |

---

### 3.2 `categoria`

Categorias que classificam as transações financeiras (ex: Alimentação, Transporte, Salário). São globais no sistema — não vinculadas a um usuário específico.

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id_categoria` | `SERIAL` | PK | Identificador único |
| `nome_categoria` | `VARCHAR(80)` | NOT NULL | Nome da categoria |

---

### 3.3 `metodo`

Métodos de pagamento disponíveis para registrar transações (ex: PIX, Cartão de Crédito, Dinheiro).

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id_metodo` | `SERIAL` | PK | Identificador único |
| `nome_metodo` | `VARCHAR(80)` | NOT NULL | Nome do método de pagamento |

---

### 3.4 `moeda`

Moedas suportadas pelo sistema para denominação das contas.

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id_moeda` | `SERIAL` | PK | Identificador único |
| `nome_moeda` | `VARCHAR(50)` | NOT NULL | Nome da moeda (ex: Real Brasileiro) |

---

### 3.5 `conta`

Representa uma conta financeira do usuário (conta corrente, poupança, etc). Cada conta pertence a um usuário e é denominada em uma moeda.

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id_conta` | `SERIAL` | PK | Identificador único |
| `id_usuario` | `INT` | FK → `usuario`, NOT NULL | Proprietário da conta |
| `id_moeda` | `INT` | FK → `moeda` | Moeda da conta |
| `nome_conta` | `VARCHAR(100)` | NOT NULL | Nome da conta (ex: Nubank) |
| `saldo_conta` | `NUMERIC(14,2)` | DEFAULT 0 | Saldo atual |

---

### 3.6 `carteira`

Agrupa contas em uma carteira virtual, permitindo ao usuário organizar suas contas em conjuntos lógicos.

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id_carteira` | `SERIAL` | PK | Identificador único |
| `id_usuario` | `INT` | FK → `usuario`, NOT NULL | Proprietário da carteira |
| `nome_carteira` | `VARCHAR(100)` | NOT NULL | Nome da carteira |

---

### 3.7 `carteira_has_conta`

Tabela associativa que implementa o relacionamento muitos-para-muitos entre `carteira` e `conta`. Uma carteira pode conter várias contas e, embora incomum, uma conta poderia aparecer em mais de uma carteira.

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id_carteira_has_conta` | `SERIAL` | PK | Identificador único do vínculo |
| `id_carteira` | `INT` | FK → `carteira`, NOT NULL | Carteira |
| `id_conta` | `INT` | FK → `conta`, NOT NULL | Conta vinculada |

---

### 3.8 `transacao`

Núcleo do sistema. Registra cada movimentação financeira — entrada (receita) ou saída (despesa) — associada a uma conta, categoria, método de pagamento e carteira.

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id_transacao` | `SERIAL` | PK | Identificador único |
| `id_conta` | `INT` | FK → `conta` | Conta debitada/creditada |
| `id_categoria` | `INT` | FK → `categoria` | Categoria da transação |
| `id_metodo` | `INT` | FK → `metodo` | Método de pagamento |
| `id_carteira` | `INT` | FK → `carteira` | Carteira associada |
| `valor` | `NUMERIC(14,2)` | NOT NULL | Valor da transação |
| `descricao` | `TEXT` | — | Descrição livre |
| `quitado` | `BOOLEAN` | DEFAULT FALSE | Indica se foi quitada |
| `arquivado` | `BOOLEAN` | DEFAULT FALSE | Indica se foi arquivada (soft delete) |
| `data` | `TIMESTAMP` | NOT NULL | Data da transação |
| `entrada` | `BOOLEAN` | NOT NULL | `TRUE` = receita, `FALSE` = despesa |

> **Nota de design:** transações não são deletadas do banco — apenas arquivadas via o campo `arquivado`. O método `delete` ainda existe no model mas o comentário no código indica que pode ser substituído por arquivamento.

---

### 3.9 `logs`

Registra operações realizadas no sistema para fins de auditoria. Os campos `anterior` e `posterior` armazenam o estado do registro antes e depois da operação, usando o tipo `JSONB` do PostgreSQL.

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id_log` | `SERIAL` | PK | Identificador único |
| `id_usuario` | `INT` | FK → `usuario` | Usuário que executou a operação |
| `operacao` | `VARCHAR(50)` | NOT NULL | Tipo de operação (INSERT, UPDATE, DELETE) |
| `tabela` | `VARCHAR(50)` | NOT NULL | Tabela afetada |
| `anterior` | `JSONB` | — | Estado anterior do registro |
| `posterior` | `JSONB` | — | Estado posterior do registro |
| `data` | `TIMESTAMP` | DEFAULT NOW() | Momento da operação |

---

## 4. Relacionamentos

| Tabela origem | Coluna | Tabela destino | Tipo | Comportamento ao deletar |
|---|---|---|---|---|
| `conta` | `id_usuario` | `usuario` | N:1 | CASCADE |
| `conta` | `id_moeda` | `moeda` | N:1 | SET NULL |
| `carteira` | `id_usuario` | `usuario` | N:1 | CASCADE |
| `carteira_has_conta` | `id_carteira` | `carteira` | N:1 | CASCADE |
| `carteira_has_conta` | `id_conta` | `conta` | N:1 | CASCADE |
| `transacao` | `id_conta` | `conta` | N:1 | SET NULL |
| `transacao` | `id_categoria` | `categoria` | N:1 | SET NULL |
| `transacao` | `id_metodo` | `metodo` | N:1 | SET NULL |
| `transacao` | `id_carteira` | `carteira` | N:1 | SET NULL |
| `logs` | `id_usuario` | `usuario` | N:1 | SET NULL |

---

## 5. Decisões de Design

**Soft delete em transações.** O campo `arquivado` permite ocultar transações da listagem principal sem removê-las do banco. Isso preserva o histórico financeiro completo do usuário mesmo para lançamentos descartados.

**Google OAuth desacoplado.** O campo `google_id_usuario` é nullable e separado de `senha_usuario`, permitindo que o usuário use um ou outro método de login sem conflitos — e futuramente vincule ambos à mesma conta.

**JSONB nos logs.** Armazenar o estado anterior e posterior das operações em JSONB é flexível o suficiente para cobrir qualquer tabela, sem necessidade de criar colunas específicas para cada tipo de dado auditado.

**Carteira como agrupador.** A entidade `carteira` existe para permitir que o usuário visualize o saldo consolidado de múltiplas contas em um único lugar — uma abstração comum em apps de finanças pessoais.
