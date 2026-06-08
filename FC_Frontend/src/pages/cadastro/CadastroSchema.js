/**
 * Valida os dados do formulário de Cadastro
 * @param {Object} data - Dados do formulário
 * @returns {string|null} - Mensagem de erro ou null se válido
 */
export const validarCadastro = (data) => {
  if (!data.nome.trim()) {
    return "Por favor, informe seu nome completo.";
  }
  if (!data.email.trim()) {
    return "Por favor, informe seu email.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return "Por favor, informe um email válido.";
  }
  if (!data.telefone.trim()) {
    return "Por favor, informe seu telefone.";
  }
  if (data.senha.length < 6) {
    return "A senha deve ter pelo menos 6 caracteres.";
  }
  if (data.senha !== data.confirmarSenha) {
    return "As senhas não coincidem.";
  }
  return null;
};

/**
 * Formata o número de telefone para (XX) XXXXX-XXXX
 * @param {string} valor 
 * @returns {string}
 */
export const formatarTelefone = (valor) => {
  const numeros = valor.replace(/\D/g, "");
  if (numeros.length <= 11) {
    return numeros
      .replace(/^(\d{2})/, "($1) ")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }
  return valor.slice(0, 15);
};
