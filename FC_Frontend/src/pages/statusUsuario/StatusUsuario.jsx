import React from "react";
import Header from "../../components/componentesPadrao/header/Header";
import Footer from "../../components/componentesPadrao/footer/Footer";
import FormStatusUsuario from "../../components/componentesPadrao/formStatusUsuario/FormStatusUsuario";
import TableStatusUsuario from "../../components/componentesPadrao/tableStatusUsuario/TableStatusUsuario";
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
