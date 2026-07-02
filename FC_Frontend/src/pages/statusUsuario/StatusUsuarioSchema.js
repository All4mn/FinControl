export const validarStatusUsuario = (data) => {
  if (!data.nome_status_usuario?.trim()) {
    return "O nome do status é obrigatório.";
  }
  // se quiser limitar o tamanho
  if (data.nome_status_usuario.length > 50) {
    return "O nome deve ter no máximo 50 caracteres.";
  }
  return null; // válido
};