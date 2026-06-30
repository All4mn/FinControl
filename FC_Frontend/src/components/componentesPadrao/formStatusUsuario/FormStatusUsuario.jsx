import React from "react";
import styles from "./FormStatusUsuario.module.css";

const FormStatusUsuario = ({
  formData,
  editId,
  loading,
  onChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.formRow}>
        <input
          type="text"
          name="nome_status"
          placeholder="Nome do status"
          value={formData.nome_status}
          onChange={onChange}
          className={styles.input}
          disabled={loading}
        />
        <button type="submit" disabled={loading} className={styles.btn}>
          {loading ? "Salvando..." : editId ? "Atualizar" : "Adicionar"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={onCancel}
            className={styles.btnCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default FormStatusUsuario;
