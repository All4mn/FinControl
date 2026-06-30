export const validarCarteiraHasConta = (data) => {
  if (!data.id_carteira || isNaN(data.id_carteira)) {
    return "Um ID de carteira válido é obrigatório.";
  }
  if (!data.id_conta || isNaN(data.id_conta)) {
    return "Um ID de conta válido é obrigatório.";
  }

  return null; // Retorna null se estiver tudo ok
};