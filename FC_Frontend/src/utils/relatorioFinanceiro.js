import { dataTransacaoParaDataLocal } from "./dataTransacao.js";

export const filtrarTransacoesDasContas = (transacoes, contas) => {
  const idsContas = new Set((contas || []).map((conta) => String(conta.id_conta)));
  return (transacoes || []).filter(
    (transacao) => idsContas.has(String(transacao.id_conta)) && transacao.arquivado !== true,
  );
};

export const calcularSaldoAcumulado = (transacoes, moeda, dataLimite) => {
  let total = 0;
  let quantidade = 0;

  transacoes.forEach((transacao) => {
    const data = dataTransacaoParaDataLocal(transacao.data);
    const quitado = transacao.quitado === true || transacao.quitado === "true";
    const valor = Number(transacao.valor);

    if (
      !quitado
      || transacao.arquivado === true
      || (transacao.nome_moeda || "Real") !== moeda
      || Number.isNaN(data.getTime())
      || data > dataLimite
      || !Number.isFinite(valor)
    ) return;

    total += (transacao.entrada ? 1 : -1) * valor;
    quantidade += 1;
  });

  return quantidade ? total : null;
};