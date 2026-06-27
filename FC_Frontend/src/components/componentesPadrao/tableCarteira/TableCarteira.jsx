import React from "react";
import styles from "./TableCarteira.module.css";

const TableCarteira = ({ carteiras, loading, onEdit, onDelete }) => {
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
          {carteiras.map((carteira) => (
            <tr key={carteira.id_carteira}>
              <td>{carteira.id_carteira}</td>
              <td>{carteira.nome_carteira}</td>
              <td>
                <button
                  className={styles.btnEdit}
                  onClick={() => onEdit(carteira)}
                  disabled={loading}
                >
                  Editar
                </button>
                <button
                  className={styles.btnDelete}
                  onClick={() => onDelete(carteira.id_carteira)}
                  disabled={loading}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
          {carteiras.length === 0 && !loading && (
            <tr>
              <td colSpan="3" className={styles.empty}>
                Nenhuma carteira cadastrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableCarteira;
