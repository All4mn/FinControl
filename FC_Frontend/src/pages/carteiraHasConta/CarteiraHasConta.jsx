import React from "react";
import axios from "axios"; // Adicionado pois é usado no fetchCarteiraHasConta
import Header from "../../components/componentesPadrao/header/Header";
import Footer from "../../components/componentesPadrao/footer/Footer";
import styles from "./CarteiraHasConta.module.css";
import { useCarteiraHasConta } from "./useCarteiraHasConta";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

const CarteiraHasConta = () => {
  const [carteiraHasConta, setCarteiraHasConta] = React.useState([]);

  const fetchCarteiraHasConta = React.useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/carteira-has-conta`, {
        withCredentials: true,
      });

      const dados = response?.data?.dados ?? [];
      setCarteiraHasConta(dados);

      if (!response.data) {
        throw new Error("Erro ao carregar CarteiraHasConta");
      }
    } catch (error) {
      console.error("Erro ao carregar CarteiraHasConta:", error);
    }
  }, []);

  const { formData, loading, error, handleChange, handleSubmit } =
    useCarteiraHasConta();

  const handleSubmitSuccess = async (e) => {
    const success = await handleSubmit(e);

    if (success) {
      await fetchCarteiraHasConta();
    }
  };

  React.useEffect(() => {
    fetchCarteiraHasConta();
  }, [fetchCarteiraHasConta]);

  return (
    <div className={styles.fullWindow}>
      <Header logado={true} />

      <div className={styles.container}>
        <div className={styles.title}>
          <h1>CarteiraHasConta</h1>
        </div>

        {/* Layout estruturado para exibir o Formulário e a Tabela lado a lado ou empilhados */}
        <div className={styles.contentLayout}>
          {/* COLUNA/SEÇÃO DO FORMULÁRIO */}
          <div className={styles.card}>
            <h2 className={styles.subTitulo}>Novo Vínculo</h2>

            {error && <div className={styles.erro}>{error}</div>}

            <form onSubmit={handleSubmitSuccess} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="id_carteira">ID da Carteira</label>
                <input
                  id="id_carteira"
                  name="id_carteira"
                  type="number"
                  placeholder="Ex: 1"
                  value={formData.id_carteira}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="id_conta">ID da Conta</label>
                <input
                  id="id_conta"
                  name="id_conta"
                  type="number"
                  placeholder="Ex: 3"
                  value={formData.id_conta}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <button type="submit" disabled={loading} className={styles.btn}>
                {loading ? "Processando..." : "Criar Vínculo"}
              </button>
            </form>
          </div>

          {/* COLUNA/SEÇÃO DA TABELA DE VÍNCULOS */}
          <section className={styles.tableSection}>
            <h2 className={styles.subTitulo}>Vínculos Existentes</h2>

            <div className={styles.tableWrapper}>
              <table className={styles.carteiraHasContaTable}>
                <thead>
                  <tr>
                    <th>ID CarteiraHasConta</th>
                    <th>ID Carteira</th>
                    <th>ID Conta</th>
                    <th>Nome Carteira</th>
                    <th>Nome Conta</th>
                    <th>Usuário Carteira</th>
                  </tr>
                </thead>
                <tbody>
                  {carteiraHasConta.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={styles.emptyRow}>
                        Nenhum vínculo encontrado.
                      </td>
                    </tr>
                  ) : (
                    carteiraHasConta.map((item) => (
                      <tr key={item.id_carteira_has_conta}>
                        <td>{item.id_carteira_has_conta ?? "—"}</td>
                        <td>{item.id_carteira ?? "—"}</td>
                        <td>{item.id_conta ?? "—"}</td>
                        <td>{item.nome_carteira ?? "—"}</td>
                        <td>{item.nome_conta ?? "—"}</td>
                        <td>{item.nome_usuario ?? "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      <footer className={styles.footer}>
        <Footer />
      </footer>
    </div>
  );
};

export default CarteiraHasConta;
