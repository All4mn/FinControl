export const validarCarteira = (data) => {
  if (!data.nome_carteira?.trim()) {
    return "O nome da carteira é obrigatório.";
  }
  if (data.nome_carteira.length > 100) {
    return "O nome da carteira deve ter no máximo 100 caracteres.";
  }
  return null;
};
