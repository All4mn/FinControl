import React from "react";
import styles from "./TableStatusUsuario.module.css";

const TableStatusUsuario = ({ statusList, loading, onEdit, onDelete }) => {
  return (
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
            <tr key={status.id_status_usuario}>
              <td>{status.id_status_usuario}</td>
              <td>{status.nome_status_usuario}</td>
              <td>
                <button
                  onClick={() => onEdit(status)}
                  className={styles.btnEdit}
                  disabled={loading}
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(status.id_status_usuario)}
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
  );
};

export default TableStatusUsuario;
