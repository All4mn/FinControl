# Modelo Base de Entidade (Boilerplate)

Este documento serve como referência técnica para a criação de novas funcionalidades (features) no projeto, garantindo a padronização da arquitetura em camadas e convenções de nomenclatura.

## Estrutura de Pastas
Ao criar uma nova entidade (ex: `Produto`), a estrutura deve ser:
`src/features/[nome_entidade]/`

- `[nome_entidade].controller.js`
- `[nome_entidade].service.js`
- `[nome_entidade].repository.js`
- `[nome_entidade]Routes.js`

---

## Modelos de Código

### 1. Repository (`[entity].repository.js`)
Responsável pelas queries SQL e interação direta com o banco.

```javascript
import database from "../../config/db.js";

export class [Entity]Repository {
  async findAll() {
    const response = await database.query(
      "SELECT * FROM [entity] ORDER BY id_[entity] DESC"
    );
    return response.rows;
  }

  async findById(id) {
    const response = await database.query(
      "SELECT * FROM [entity] WHERE id_[entity] = $1",
      [id]
    );
    return response.rows[0] || null;
  }

  async create(dados) {
    // Ajuste as colunas conforme a tabela
    const { nome_[entity] } = dados;
    const response = await database.query(
      `INSERT INTO [entity] (nome_[entity]) VALUES ($1) RETURNING *`,
      [nome_[entity]]
    );
    return response.rows[0];
  }

  async update(id, dados) {
    const { nome_[entity] } = dados;
    const response = await database.query(
      `UPDATE [entity] SET nome_[entity] = $1 WHERE id_[entity] = $2 RETURNING *`,
      [nome_[entity], id]
    );
    return response.rows[0] || null;
  }

  async delete(id) {
    const response = await database.query(
      "DELETE FROM [entity] WHERE id_[entity] = $1",
      [id]
    );
    return response.rowCount > 0;
  }
}
```

### 2. Service (`[entity].service.js`)
Camada de regras de negócio e validações.

```javascript
export class [Entity]Service {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findById(id) {
    if (!id) throw new Error("ID é obrigatório");
    return await this.repository.findById(id);
  }

  async create(dados) {
    if (!dados.nome_[entity]) throw new Error("Nome é obrigatório");
    return await this.repository.create(dados);
  }

  async update(id, dados) {
    if (!id) throw new Error("ID é obrigatório");
    return await this.repository.update(id, dados);
  }

  async delete(id) {
    if (!id) throw new Error("ID é obrigatório");
    return await this.repository.delete(id);
  }
}
```

### 3. Controller (`[entity].controller.js`)
Gerencia o fluxo de entrada (req) e saída (res).

```javascript
export class [Entity]Controller {
  constructor(service) {
    this.service = service;
    this.listar = this.listar.bind(this);
    this.buscarPorId = this.buscarPorId.bind(this);
    this.criar = this.criar.bind(this);
    this.atualizar = this.atualizar.bind(this);
    this.deletar = this.deletar.bind(this);
  }

  async listar(req, res) {
    try {
      const dados = await this.service.findAll();
      return res.status(200).send({ sucesso: true, dados });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const dado = await this.service.findById(id);
      if (!dado) return res.status(404).send({ sucesso: false, mensagem: "Não encontrado" });
      return res.status(200).send({ sucesso: true, dados: dado });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: err.message });
    }
  }

  async criar(req, res) {
    try {
      const novo = await this.service.create(req.body);
      return res.status(201).send({ sucesso: true, dados: novo });
    } catch (err) {
      return res.status(400).send({ sucesso: false, mensagem: err.message });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const atualizado = await this.service.update(id, req.body);
      if (!atualizado) return res.status(404).send({ sucesso: false, mensagem: "Não encontrado" });
      return res.status(200).send({ sucesso: true, dados: atualizado });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: err.message });
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const deletado = await this.service.delete(id);
      if (!deletado) return res.status(404).send({ sucesso: false, mensagem: "Não encontrado" });
      return res.status(200).send({ sucesso: true, mensagem: "Removido com sucesso" });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: err.message });
    }
  }
}
```

### 4. Routes (`[entity]Routes.js`)
Configuração das rotas e injeção de dependência manual.

```javascript
import { [Entity]Controller } from "./[entity].controller.js";
import { [Entity]Repository } from "./[entity].repository.js";
import { [Entity]Service } from "./[entity].service.js";

const repository = new [Entity]Repository();
const service = new [Entity]Service(repository);
const controller = new [Entity]Controller(service);

export async function [entity]Routes(app) {
  app.get("/", controller.listar);
  app.get("/:id", controller.buscarPorId);
  app.post("/", controller.criar);
  app.put("/:id", controller.atualizar);
  app.delete("/:id", controller.deletar);
}
```

---

## Checklist de Adaptação
1. [ ] Renomear arquivos substituindo `[entity]` pelo nome da entidade (ex: `produto.service.js`).
2. [ ] No código, substituir `[Entity]` (Maiúsculo) e `[entity]` (minúsculo) pelo nome correto.
3. [ ] Ajustar as queries SQL no `repository.js` com os nomes reais das colunas e tabela.
4. [ ] Implementar validações de campos obrigatórios no `service.js`.
5. [ ] Registrar a nova rota em `src/app.js`.
