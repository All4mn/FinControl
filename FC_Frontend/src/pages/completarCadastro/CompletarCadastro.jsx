import Header from "../../components/componentesPadrao/header/Header";
import Footer from "../../components/componentesPadrao/footer/Footer";
import styles from "./CompletarCadastro.module.css";
import { useCompletarCadastro } from "./useCompletarCadastro";

export default function CompletarCadastro() {
  const {
    formData,
    erro,
    carregando,
    handleChange,
    handleTelefoneChange,
    handleSubmit,
  } = useCompletarCadastro();

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
