import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/componentesPadrao/header/Header";
import Footer from "../../components/componentesPadrao/footer/Footer";
import styles from "./CompletarCadastro.module.css";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

const initialFormData = {
  nome: "",
  email: "",
  telefone: "",
  senha: "",
  confirmarSenha: "",
};

export default function CompletarCadastro() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState(initialFormData);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);

  const formatarTelefone = (valor) => {
    const numeros = String(valor).replace(/\D/g, "");
    if (numeros.length <= 11) {
      return numeros
        .replace(/^(\d{2})/, "($1) ")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
    return valor;
  };

  useEffect(() => {
    const routeUsuario = location.state?.usuario;
    const storedUsuario = window.sessionStorage.getItem(
      "completarCadastroUsuario",
    );
    const usuario =
      routeUsuario || (storedUsuario ? JSON.parse(storedUsuario) : null);

    if (!usuario) {
      navigate("/login");
      return;
    }

    setUsuarioId(usuario.id_usuario);
    setFormData({
      nome: usuario.nome_usuario || "",
      email: usuario.email_usuario || "",
      telefone: usuario.telefone_usuario
        ? formatarTelefone(usuario.telefone_usuario)
        : "",
      senha: "",
      confirmarSenha: "",
    });

    if (routeUsuario) {
      window.sessionStorage.setItem(
        "completarCadastroUsuario",
        JSON.stringify(usuario),
      );
    }
  }, [location.state, navigate]);

  const handleTelefoneChange = (e) => {
    const valorFormatado = formatarTelefone(e.target.value);
    setFormData((prev) => ({ ...prev, telefone: valorFormatado }));
    setErro("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    e.preventDefault();
    if (!validarFormulario() || !usuarioId) return;

    setCarregando(true);
    try {
      const dados = {
        nome_usuario: formData.nome.trim(),
        email_usuario: formData.email.trim(),
        telefone_usuario: formData.telefone.replace(/\D/g, ""),
        senha_usuario: formData.senha,
      };

      const response = await axios.put(
        `${API_BASE_URL}/usuarios/${usuarioId}`,
        dados,
      );

      window.sessionStorage.removeItem("completarCadastroUsuario");
      localStorage.setItem("id_usuario", response.data.dados.id_usuario);
      localStorage.setItem("nome_usuario", response.data.dados.nome_usuario);
      localStorage.setItem("email_usuario", response.data.dados.email_usuario);

      navigate("/dashboard");
    } catch (err) {
      console.error("Erro ao completar cadastro:", err);
      setErro(
        err.response?.data?.mensagem ||
          "Erro ao completar cadastro. Tente novamente.",
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.page}>
      <Header logado={false} />

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.titulo}>Complete seu cadastro</h1>
          <p className={styles.subtitulo}>
            Os dados já preenchidos foram trazidos do Google. Complete os campos
            faltantes.
          </p>

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
                  type="password"
                  name="senha"
                  placeholder="Senha"
                  value={formData.senha}
                  onChange={handleChange}
                  className={styles.input}
                  autoComplete="new-password"
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
                  type="password"
                  name="confirmarSenha"
                  placeholder="Confirmar senha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  className={styles.input}
                  autoComplete="new-password"
                />
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
                "Finalizar cadastro"
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
