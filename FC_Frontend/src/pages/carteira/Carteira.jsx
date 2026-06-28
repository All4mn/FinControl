import React from "react";
import Header from "../../components/componentesPadrao/headerLogged/HeaderLogged.jsx";
import Footer from "../../components/componentesPadrao/footer/Footer.jsx";
import FormCarteira from "../../components/componentesPadrao/formCarteira/FormCarteira.jsx";
import TableCarteira from "../../components/componentesPadrao/tableCarteira/TableCarteira.jsx";
import styles from "./Carteira.module.css";
import { useCarteira } from "./useCarteira";

export default function Carteira() {
  const {
    usuario,
    carregando,
    error,
    formData,
    editId,
    carteiras,
    loading,
    handleChange,
    handleSubmit,
    handleDelete,
    handleEdit,
    resetForm,
  } = useCarteira();

  if (carregando) {
    return (
      <div className={styles.page}>
        <Header usuario={{ nome_usuario: "Carregando..." }} logado={true} />
        <main className={styles.main}>
          <p>Carregando suas carteiras...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header usuario={usuario} logado={true} />
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.headerCard}>
            <div>
              <h1 className={styles.titulo}>Carteiras</h1>
              <p className={styles.descricao}>
                Gerencie as carteiras associadas à sua conta e mantenha o controle
                das suas finanças.
              </p>
            </div>
          </div>

          {error && <div className={styles.erro}>{error}</div>}

          <FormCarteira
            formData={formData}
            editId={editId}
            loading={loading}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />

          <TableCarteira
            carteiras={carteiras}
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
