import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/componentesPadrao/header/Header";
import Footer from "../../components/componentesPadrao/footer/Footer";
import styles from "./Login.module.css";
import { GoogleLogin } from "@react-oauth/google";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [googleReady, setGoogleReady] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleInitialized = useRef(false);

  const handleGoogleCredentialResponse = async (response) => {
    if (!response?.credential) {
      setErro("Não foi possível obter o token do Google.");
      setGoogleLoading(false);
      return;
    }

    const idToken = response.credential;

    try {
      setGoogleLoading(true);
      setErro("");

      const result = await axios.post(`${API_BASE_URL}/usuarios/login-google`, {
        idToken,
      });

      if (result.data.sucesso) {
        const { dados: usuario, cadastroIncompleto } = result.data;

        localStorage.setItem("id_usuario", usuario.id_usuario);
        localStorage.setItem("nome_usuario", usuario.nome_usuario);
        localStorage.setItem("email_usuario", usuario.email_usuario);

        if (cadastroIncompleto) {
          window.sessionStorage.setItem(
            "completarCadastroUsuario",
            JSON.stringify(usuario),
          );
          navigate("/completar-cadastro", {
            state: { usuario, fromGoogle: true },
          });
        } else {
          navigate("/dashboard");
        }
      } else {
        setErro(result.data.mensagem || "Erro no login com Google.");
      }
    } catch (err) {
      console.error("Erro no login com Google:", err);
      setErro(
        err.response?.data?.mensagem ||
          "Erro ao fazer login com Google. Tente novamente.",
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google && window.google.accounts) {
        if (googleInitialized.current || window.__fc_google_init_done__) {
          setGoogleReady(true);
          clearInterval(interval);
          return;
        }

        if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
          setErro(
            "Variável VITE_GOOGLE_CLIENT_ID não está definida. Verifique .env",
          );
          clearInterval(interval);
          return;
        }

        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
            cancel_on_tap_outside: true,
          });

          googleInitialized.current = true;
          window.__fc_google_init_done__ = true;
          setGoogleReady(true);
        } catch (err) {
          console.error("Erro ao inicializar Google Identity:", err);
          setErro("Erro ao carregar login do Google. Recarregue a página.");
        } finally {
          clearInterval(interval);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = async () => {
    setErro("");

    if (!googleReady) {
      setErro(
        "O login do Google ainda está carregando. Aguarde e tente novamente.",
      );
      return;
    }

    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      setErro(
        "Variável VITE_GOOGLE_CLIENT_ID não está definida. Verifique .env",
      );
      return;
    }

    try {
      window.google.accounts.id.prompt();
    } catch (err) {
      console.error("Erro ao iniciar login Google:", err);
      setErro("Erro ao iniciar login do Google. Tente novamente.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErro("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(
      "Enviando dados para:",
      `${import.meta.env.VITE_BACKEND_RENDER_URL}/usuarios/login`,
    );
    if (!formData.email || !formData.senha) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    setCarregando(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/usuarios/login`, {
        email_usuario: formData.email,
        senha_usuario: formData.senha,
      });

      console.log("Login realizado:", response.data);
      localStorage.setItem("usuario", JSON.stringify(response.data));
      navigate("/dashboard");
    } catch (err) {
      console.log("Erro no login:", err);
      setErro("Email ou senha incorretos. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.page}>
      <Header logado={false} />

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.titulo}>Faça seu Login</h1>

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
                  autoComplete="current-password"
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

            <Link to="/esqueci-senha" className={styles.linkEsqueciSenha}>
              Esqueci minha senha
            </Link>

            <button
              type="submit"
              className={styles.btnEntrar}
              disabled={carregando}
            >
              {carregando ? <span className={styles.spinner}></span> : "Entrar"}
            </button>
          </form>

          <div className={styles.divisor}>
            <span>ou</span>
          </div>

          <GoogleLogin onSuccess={handleGoogleCredentialResponse} onError={() => setErro("Erro no login com Google. Tente novamente.")} />

          <p className={styles.linkCadastro}>
            Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>


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
    </main>
      <Footer />
    </div>
  );
}
