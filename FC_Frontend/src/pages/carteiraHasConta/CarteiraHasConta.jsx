import React from "react";
import axios from "axios";
import Header from "../../components/componentesPadrao/header/Header";
import Footer from "../../components/componentesPadrao/footer/Footer";
import styles from "./CarteiraHasConta.module.css";
import { useCarteiraHasConta } from "./useCarteiraHasConta";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

const CarteiraHasConta = () => {
  const [carteiraHasConta, setCarteiraHasConta] = React.useState([]);
  const [sucesso, setSucesso] = React.useState("");
  const [editandoId, setEditandoId] = React.useState(null);

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

  const {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
    handleDelete,
    handleEdit,
    setFormData,
    resetForm,
  } = useCarteiraHasConta();

  const handleSubmitSuccess = async (e) => {
    if (editandoId) {
      const success = await handleEdit(editandoId, {
        id_carteira: Number(formData.id_carteira),
        id_conta: Number(formData.id_conta),
      });

      if (success) {
        setEditandoId(null);
        resetForm();
        await fetchCarteiraHasConta();
      }
      return;
    }

    const success = await handleSubmit(e);

    if (success) {
      setSucesso("Vínculo criado com sucesso!");
      await fetchCarteiraHasConta();
      setTimeout(() => setSucesso(""), 3000);
    }
  };

  const handleDeleteSucess = async (id) => {
    const success = await handleDelete(id);
    if (success) {
      await fetchCarteiraHasConta();
    }
  };

  const handleEditClick = (item) => {
    setEditandoId(item.id_carteira_has_conta);
    setFormData({
      id_carteira: item.id_carteira ?? "",
      id_conta: item.id_conta ?? "",
    });
  };

  const handleCancelarEdicao = () => {
    setEditandoId(null);
    resetForm();
  };

  React.useEffect(() => {
    fetchCarteiraHasConta();
  }, [fetchCarteiraHasConta]);

  return (
    <div className={styles.fullWindow}>
      <Header logado={true} />

      <div className={styles.container}>
        <h1 className={styles.subTitulo}></h1>

        <div className={styles.contentLayout}>
          <div className={styles.card}>
            <h2 className={styles.subTitulo}>
              {editandoId ? "Editar Vínculo" : "Novo Vínculo"}
            </h2>

            {error && <div className={styles.erro}>{error}</div>}
            {sucesso && <div className={styles.sucesso}>{sucesso}</div>}

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
                {loading ? <span className={styles.spinner} /> : "Criar Vínculo"}
              </button>
              <div className={styles.actionsRow}>
                <button type="submit" disabled={loading} className={styles.btn}>
                  {loading
                    ? "Processando..."
                    : editandoId
                      ? "Salvar Alterações"
                      : "Criar Vínculo"}
                </button>

                {editandoId && (
                  <button
                    type="button"
                    onClick={handleCancelarEdicao}
                    className={styles.btnSecondary}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <section className={styles.tableSection}>
            <h2 className={styles.subTitulo}>Vínculos Existentes</h2>

            <div className={styles.tableWrapper}>
              <table className={styles.carteiraHasContaTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>ID Carteira</th>
                    <th>ID Conta</th>
                    <th>Nome Carteira</th>
                    <th>Nome Conta</th>
                    <th>Usuário</th>
                    <th>Usuário Carteira</th>
                    <th>Ações</th>
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
                        <td>
                          <button onClick={() => handleEditClick(item)}>
                            Editar
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteSucess(item.id_carteira_has_conta)
                            }
                          >
                            Excluir
                          </button>
                        </td>
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
