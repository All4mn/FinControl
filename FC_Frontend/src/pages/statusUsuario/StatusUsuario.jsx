import React from "react";
import Header from "../../components/componentesPadrao/header/Header";
import Footer from "../../components/componentesPadrao/footer/Footer";
import styles from "./StatusUsuario.module.css";
import { useStatusUsuario } from "./useStatusUsuario";
import StatusUsuarioCard from "./components/StatusUsuarioCard/StatusUsuarioCard.jsx";
import FormStatusUsuario from "./components/StatusUsuarioFeedback/StatusUsuarioFeedback.jsx";
import TableStatusUsuario from "../../components/componentesPadrao/table/TableStatusUsuario.jsx";

export default function StatusUsuario() {
  const {
    statusList,
    formData,
    editId,
    loading,
    error,
    sucesso,
    handleChange,
    handleSubmit,
    handleDelete,
    handleEdit,
    resetForm,
  } = useStatusUsuario();

  return (
    <div className={styles.page}>
      <Header logado={true} />
      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.titulo}>Gerenciar Status de Usuário</h1>

          {error && <div className={styles.erro}>{error}</div>}
          {sucesso && <div className={styles.sucesso}>{sucesso}</div>}

          <FormStatusUsuario
            formData={formData}
            editId={editId}
            loading={loading}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />

          <TableStatusUsuario
            statusList={statusList}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
