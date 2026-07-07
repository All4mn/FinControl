import React from "react";
import Header from "../../components/componentesPadrao/header/Header";
import Footer from "../../components/componentesPadrao/footer/Footer";
import styles from "./StatusUsuario.module.css";
import { useStatusUsuario } from "./useStatusUsuario";
import StatusUsuarioCard from "./components/StatusUsuarioCard/StatusUsuarioCard.jsx";

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
      <Header logado={true} />
      <main className={styles.main}>
        <StatusUsuarioCard
          statusList={statusList}
          formData={formData}
          editId={editId}
          loading={loading}
          error={error}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
      <Footer />
    </div>
  );
}
