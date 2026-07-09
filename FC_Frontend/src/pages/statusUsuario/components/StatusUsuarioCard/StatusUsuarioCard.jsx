import React from "react";
import FormStatusUsuario from "../../../../components/componentesPadrao/formStatusUsuario/FormStatusUsuario.jsx";
import TableStatusUsuario from "../../../../components/componentesPadrao/tableStatusUsuario/TableStatusUsuario.jsx";
import StatusUsuarioFeedback from "../StatusUsuarioFeedback/StatusUsuarioFeedback.jsx";
import styles from "./StatusUsuarioCard.module.css";

const StatusUsuarioCard = ({
  statusList,
  formData,
  editId,
  loading,
  error,
  onChange,
  onSubmit,
  onCancel,
  onEdit,
  onDelete,
}) => {
  return (
    <section className={styles.card}>
      <h1 className={styles.titulo}>Gerenciar Status de Usuário</h1>

      <StatusUsuarioFeedback message={error} />

      <FormStatusUsuario
        formData={formData}
        editId={editId}
        loading={loading}
        onChange={onChange}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />

      <TableStatusUsuario
        statusList={statusList}
        loading={loading}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </section>
  );
};

export default StatusUsuarioCard;