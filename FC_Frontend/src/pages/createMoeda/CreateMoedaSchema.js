export const validarCreateMoeda = (data) => {
  if (!data.nome_moeda?.trim()) return "Nome da moeda é obrigatório.";

  if (data.nome_moeda.trim().length < 2) {
    return "Nome da moeda deve ter pelo menos 2 caracteres.";
  }

  if (data.nome_moeda.trim().length > 50) {
    return "Nome da moeda deve ter no máximo 50 caracteres.";
  }

  return null; // Retorna null se estiver tudo ok
};