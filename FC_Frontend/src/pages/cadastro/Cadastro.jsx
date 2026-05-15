import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/componentesPadrao/header/Header";
import Footer from "../../components/componentesPadrao/footer/Footer";
import styles from "./Cadastro.module.css";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

export default function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErro("");
  };

  const formatarTelefone = (valor) => {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length <= 11) {
      return numeros
        .replace(/^(\d{2})/, "($1) ")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
    return valor.slice(0, 15);
  };

  const handleTelefoneChange = (e) => {
    const valorFormatado = formatarTelefone(e.target.value);
    setFormData((prev) => ({ ...prev, telefone: valorFormatado }));
    setErro("");
  };

  const validarFormulario = () => {
    if (!formData.nome.trim()) {
      setErro("Por favor, informe seu nome completo.");
      return false;
    }
    if (!formData.email.trim()) {
      setErro("Por favor, informe seu email.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErro("Por favor, informe um email válido.");
      return false;
    }
    if (!formData.telefone.trim()) {
      setErro("Por favor, informe seu telefone.");
      return false;
    }
    if (formData.senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return false;
    }
    if (formData.senha !== formData.confirmarSenha) {
      setErro("As senhas não coincidem.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    console.log(
      formData.nome,
      formData.email,
      formData.telefone,
      formData.senha,
      API_BASE_URL
    );
    e.preventDefault();

    if (!validarFormulario()) return;

    setCarregando(true);

    try {
      const dados = {
        nome_usuario: formData.nome,
        email_usuario: formData.email,
        senha_usuario: formData.senha,
        telefone_usuario: formData.telefone.replace(/\D/g, ""),
      };
      console.log("Enviando dados para o backend:", dados);
      const response = await axios.post(`${API_BASE_URL}/usuarios`, dados); //forma mais apropriada de enviar dados para o backend
      // const response = await axios({
      //   method: "post",
      //   url: `${API_BASE_URL}/usuarios`,
      //   data: dados,
      // });
      console.log("Cadastro realizado:", response.data);
      alert("Cadastro realizado com sucesso! Faça login para continuar.");
      navigate("/login");
    } catch (err) {
      console.log("Erro no cadastro:", err);
      if (err.response?.status === 409) {
        setErro("Este email já está cadastrado.");
      } else {
        setErro("Erro ao realizar cadastro. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  };


  return (
    <div className={styles.page}>
      <Header logado={false} />

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.titulo}>Crie sua Conta</h1>

          {erro && (
            <div className={styles.erro}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.campo}>
              <div className={styles.inputWrapper}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.icone}
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  name="nome"
                  placeholder="Nome Completo"
                  value={formData.nome}
                  onChange={handleChange}
                  className={styles.input}
                  autoComplete="name"
                />
              </div>
            </div>

            <div className={styles.campo}>
              <div className={styles.inputWrapper}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.icone}
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className={styles.campo}>
              <div className={styles.inputWrapper}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.icone}
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <input
                  type="tel"
                  name="telefone"
                  placeholder="Número de Telefone"
                  value={formData.telefone}
                  onChange={handleTelefoneChange}
                  className={styles.input}
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className={styles.campo}>
              <div className={styles.inputWrapper}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.icone}
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  name="senha"
                  placeholder="Senha"
                  value={formData.senha}
                  onChange={handleChange}
                  className={styles.input}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className={styles.btnMostrarSenha}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" x2="23" y1="1" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.campo}>
              <div className={styles.inputWrapper}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.icone}
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={mostrarConfirmarSenha ? "text" : "password"}
                  name="confirmarSenha"
                  placeholder="Confirmar senha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  className={styles.input}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setMostrarConfirmarSenha(!mostrarConfirmarSenha)
                  }
                  className={styles.btnMostrarSenha}
                  aria-label={
                    mostrarConfirmarSenha ? "Ocultar senha" : "Mostrar senha"
                  }
                >
                  {mostrarConfirmarSenha ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" x2="23" y1="1" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={styles.btnCadastrar}
              disabled={carregando}
            >
              {carregando ? (
                <span className={styles.spinner}></span>
              ) : (
                "Cadastrar-se"
              )}
            </button>
          </form>

          <p className={styles.linkLogin}>
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </p>
        </div>
      </main>

      <Footer />

      <button
        className={styles.btnAcessibilidade}
        aria-label="Opções de acessibilidade"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9H15V22H13V16H11V22H9V9H3V7H21V9Z" />
        </svg>
      </button>
    </div>
  );
}
