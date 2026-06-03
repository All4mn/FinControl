/**
 * Valida os dados do formulário de Login
 * @param {Object} data - Dados do formulário (email, senha)
 * @returns {string|null} - Mensagem de erro ou null se válido
 */
export const validarLogin = (data) => {
  if (!data.email || !data.senha) {
    return "Por favor, preencha todos os campos.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return "Por favor, insira um e-mail válido.";
  }

  return null;
};
