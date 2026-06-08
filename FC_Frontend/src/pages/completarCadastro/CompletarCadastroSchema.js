/**
 * Valida os dados do formulário de Completar Cadastro
 * @param {Object} data - Dados do formulário
 * @returns {string|null} - Mensagem de erro ou null se válido
 */
export const validarCompletarCadastro = (data) => {
  if (!data.nome?.trim()) {
    return "Por favor, informe seu nome completo.";
  }
  if (!data.email?.trim()) {
    return "Por favor, informe seu email.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return "Por favor, informe um email válido.";
  }
  if (!data.telefone?.trim()) {
    return "Por favor, informe seu telefone.";
  }
  return null;
};

/**
 * Formata o número de telefone para (XX) XXXXX-XXXX
 * @param {string} valor 
 * @returns {string}
 */
export const formatarTelefone = (valor) => {
  const numeros = String(valor).replace(/\D/g, "");
  if (numeros.length <= 11) {
    return numeros
      .replace(/^(\d{2})/, "($1) ")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }
  return valor;
};
