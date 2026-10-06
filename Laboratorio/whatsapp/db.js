// import database from "../config/db.js";
import database from '../../FC_Backend_VS/src/config/db.js'
// import { TransacaoRepository } from "../models/repositories/transacao.repository.js";
import { TransacaoRepository } from '../../FC_Backend_VS/src/features/transacao/transacao.repository.js'
 

//lembrar que vamos importar funções do repositorio do backend para não descentralizar responsabilidades
const transacaoRepository = new TransacaoRepository();
 
// comparação p saber se o telefone é válido e brasileiro (padroniza o formato p DDD E nuemreo)
function padronizarTelefone(numero) {
  const digitos = String(numero).replace(/\D/g, "").replace(/^55/, "");
  return { ddd: digitos.slice(0, 2), final: digitos.slice(-8) };
}
 

export async function buscarUsuarioPorTelefone(numero) {
  const { ddd, final } = padronizarTelefone
(numero);

// tentei dxar tudo padrao ORM igual o backend, mas nao sei se tá certo
 
  const response = await database.query(
    `SELECT id_usuario, nome_usuario
       FROM usuario
      WHERE regexp_replace(telefone_usuario, '[^0-9]', '', 'g') LIKE $1
      LIMIT 1`,
    [`%${ddd}%${final}`],
  );
  // regexp_replace é do postgree e tá retirando tudo o que não for números nesse caso aqui
 
  const row = response.rows[0];
  return row ? { id: row.id_usuario, nome: row.nome_usuario } : null;
}
 

async function buscarCarteiraEContaPadrao(idUsuario) {
  const response = await database.query(
    `SELECT c.id_carteira, ct.id_conta
       FROM carteira c
       JOIN carteira_has_conta chc ON chc.id_carteira = c.id_carteira
       JOIN conta ct ON ct.id_conta = chc.id_conta
      WHERE c.id_usuario = $1
        AND c.ativo = true
        AND ct.ativo = true
      ORDER BY c.id_carteira, ct.id_conta
      LIMIT 1`,
    [idUsuario],
  );
  return response.rows[0] || null;
}
 
async function buscarMetodoPix() {
  const response = await database.query(
    "SELECT id_metodo FROM metodo WHERE nome_metodo ILIKE $1 LIMIT 1",
    ["pix"],
  );
  return response.rows[0]?.id_metodo ?? null;
}
 
async function buscarCategoriaPadrao() {
  const response = await database.query(
    "SELECT id_categoria FROM categoria WHERE nome_categoria ILIKE $1 LIMIT 1",
    ["outros"],
  );
  return response.rows[0]?.id_categoria ?? null;
}
 

export async function registrarLancamento(
  idUsuario,
  { tipo, valor, pagador, recebedor, data },
) {
  const padrao = await buscarCarteiraEContaPadrao(idUsuario);
  if (!padrao) {
    throw new Error("Usuário sem carteira/conta ativa para lançar a transação.");
  }
 
  const [id_metodo, id_categoria] = await Promise.all([
    buscarMetodoPix(),
    buscarCategoriaPadrao(),
  ]);
 
  const entrada = tipo === "receita";
  const descricao = entrada
    ? `Pix de ${pagador ?? "não identificado"}`
    : `Pix para ${recebedor ?? "não identificado"}`;
 
//precaução p se o groq nao der a data, colocar a data atual fuso de sp
  const hoje = new Date().toLocaleDateString("sv-SE", {
    timeZone: "America/Sao_Paulo",
  });
 
  return transacaoRepository.create({
    id_conta: padrao.id_conta,
    id_categoria,
    id_metodo,
    id_carteira: padrao.id_carteira,
    valor,
    descricao,
    quitado: true, // por padrão, pq já foi enviado comprovante
    arquivado: false,
    data: data ?? hoje, // tenta colocar a data q a IA extraiu e se não tiver coloca aquela lá da const acima
    entrada,
  });
}