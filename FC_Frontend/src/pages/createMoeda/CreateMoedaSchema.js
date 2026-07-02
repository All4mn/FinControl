
export const validarCreateMoeda = (data) => {
  if (!data.nome_moeda?.trim()) return "Nome da moeda é obrigatório.";

  if (data.nome_moeda.trim().length < 2) {
    return "Nome da moeda deve ter pelo menos 2 caracteres.";
  }

  return null;
};