import { Link } from "react-router-dom";
import Header from "../../components/componentesPadrao/header/Header";
import Footer from "../../components/componentesPadrao/footer/Footer";
import styles from "./Login.module.css";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useLogin } from "./useLogin";

export default function Login() {
  const {
    formData,
    mostrarSenha,
    carregando,
    erro,
    setErro,
    handleChange,
    handleSubmit,
    toggleMostrarSenha,
    handleGoogleCredentialResponse,
  } = useLogin();

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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
                  onClick={toggleMostrarSenha}
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

          {GOOGLE_CLIENT_ID ? (
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <GoogleLogin 
                onSuccess={handleGoogleCredentialResponse} 
                onError={() => setErro("Erro no login com Google. Tente novamente.")} 
              />
            </GoogleOAuthProvider>
          ) : (
            <p className={styles.erro}>Erro de configuração: ID do Google não encontrado no .env</p>
          )}

          <p className={styles.linkCadastro}>
            Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </div>

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
    </main>
      <Footer />
    </div>
  );
}
