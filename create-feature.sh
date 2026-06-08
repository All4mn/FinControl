#!/bin/bash

#para executar esse script, basta rodar o comando: bash create-feature.sh
read -p "Digite o nome da feature (!!A FEATURE DEVE CONTER O MESMO NOME DA TABELA QUE SERÁ ALTERADA!!): " SLICE_NAME

if [ -z "$SLICE_NAME" ]; then
  echo "Nome não especificado. Por favor, forneça um nome para a feature."
  exit 1
fi

if [ -d "src/features/$SLICE_NAME" ]; then
  echo "A feature '$SLICE_NAME' já existe. Por favor, escolha outro nome."
  exit 1
fi

echo "Criando slice: $SLICE_NAME"

SLICE_CAPITALIZED="${SLICE_NAME^}"

BASE_PATH="FC_Backend_VS/src/features/$SLICE_NAME"
mkdir -p "$BASE_PATH"
echo "Diretório criado: $BASE_PATH"


# Criar arquivos

cat <<EOL > "$BASE_PATH/$SLICE_NAME.routes.js" 
import { ${SLICE_CAPITALIZED}Controller } from "./$SLICE_CAPITALIZED.controller.js";
import { ${SLICE_CAPITALIZED}Repository } from "./$SLICE_CAPITALIZED.repository.js";
import { ${SLICE_CAPITALIZED}Service } from "./$SLICE_CAPITALIZED.service.js";

const repository = new ${SLICE_CAPITALIZED}Repository();
const service = new ${SLICE_CAPITALIZED}Service(repository);
const controller = new ${SLICE_CAPITALIZED}Controller(service);

export async function ${SLICE_CAPITALIZED}Routes(app) {
  app.get("/", controller.listar);
  app.get("/:id", controller.buscarPorId);
  app.post("/", controller.criar);
  app.put("/:id", controller.atualizar);
  app.delete("/:id", controller.deletar);
}
EOL

cat <<EOL > "$BASE_PATH/$SLICE_NAME.controller.js"
export class ${SLICE_CAPITALIZED}Controller {
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
EOL

cat <<EOL > "$BASE_PATH/$SLICE_NAME.service.js"
export class ${SLICE_CAPITALIZED}Service {
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
    if (!dados.nome_$SLICE_NAME) throw new Error("Nome é obrigatório");
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
EOL

cat > "$BASE_PATH/$SLICE_NAME.repository.js" << EOL
import database from "../../config/db.js";

export class ${SLICE_CAPITALIZED}Repository {
  async findAll() {
    const response = await database.query(
      \`SELECT * FROM ${SLICE_NAME} ORDER BY id_${SLICE_NAME} DESC\`
    );
    return response.rows;
  }

  async findById(id) {
    const response = await database.query(
      \`SELECT * FROM ${SLICE_NAME} WHERE id_${SLICE_NAME} = \$1\`,
      [id]
    );
    return response.rows[0] || null;
  }

  async create(dados) {
    const { nome_${SLICE_NAME} } = dados;
    const response = await database.query(
      \`INSERT INTO ${SLICE_NAME} (nome_${SLICE_NAME}) VALUES (\$1) RETURNING *\`,
      [nome_${SLICE_NAME}]
    );
    return response.rows[0];
  }

  async update(id, dados) {
    const { nome_${SLICE_NAME} } = dados;
    const response = await database.query(
      \`UPDATE ${SLICE_NAME} SET nome_${SLICE_NAME} = \$1 WHERE id_${SLICE_NAME} = \$2 RETURNING *\`,
      [nome_${SLICE_NAME}, id]
    );
    return response.rows[0] || null;
  }

  async delete(id) {
    const response = await database.query(
      \`DELETE FROM ${SLICE_NAME} WHERE id_${SLICE_NAME} = \$1\`,
      [id]
    );
    return response.rowCount > 0;
  }
}
EOL

echo "Arquivos criados para a feature '$SLICE_NAME' com sucesso!"
echo "=====================Lembre-se de:========================="
echo "1. Implementar a lógica de negócio no service."
echo "2. Testar as rotas criadas."
echo "3. Atualizar o app.js para incrementar o registro de rotas."
echo "==========================================================="