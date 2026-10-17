export const dataTransacaoParaDataLocal = (valor) => {
  const correspondencia = String(valor || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!correspondencia) return new Date(valor);

  const [, ano, mes, dia] = correspondencia;
  return new Date(Number(ano), Number(mes) - 1, Number(dia));
};