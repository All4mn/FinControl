import React from "react";
import Header from "../../components/componentesPadrao/header/Header";
import Footer from "../../components/componentesPadrao/footer/Footer";
import styles from "./StatusUsuario.module.css";
import { useStatusUsuario } from "./useStatusUsuario";

export default function StatusUsuario() {
  const {
    statusList,
    formData,
    editId,
    loading,
    error,
    handleChange,
    handleSubmit,
    handleDelete,
    handleEdit,
    resetForm,
  } = useStatusUsuario();

  return (
    <div className={styles.page}>
      <Header logado={true} /> {/* ou false, conforme seu layout */}
      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.titulo}>Gerenciar Status de Usuário</h1>

          {error && <div className={styles.erro}>{error}</div>}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <input
                type="text"
                name="nome_status"
                placeholder="Nome do status"
                value={formData.nome_status}
                onChange={handleChange}
                className={styles.input}
                disabled={loading}
              />
              <button type="submit" disabled={loading} className={styles.btn}>
                {loading ? "Salvando..." : editId ? "Atualizar" : "Adicionar"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className={styles.btnCancel}
                  disabled={loading}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          {/* Tabela */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {statusList.map((status) => (
                  <tr key={status.id_status}>
                    <td>{status.id_status}</td>
                    <td>{status.nome_status}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(status)}
                        className={styles.btnEdit}
                        disabled={loading}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(status.id_status)}
                        className={styles.btnDelete}
                        disabled={loading}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
                {statusList.length === 0 && !loading && (
                  <tr>
                    <td colSpan="3" className={styles.empty}>
                      Nenhum status cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}