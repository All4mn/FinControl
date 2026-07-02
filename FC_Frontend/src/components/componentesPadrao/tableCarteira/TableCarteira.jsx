import React from "react";
import styles from "./TableCarteira.module.css";

const TableCarteira = ({ carteiras, loading }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value) || 0);
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Saldo consolidado</th>
          </tr>
        </thead>
        <tbody>
          {carteiras.map((carteira) => (
            <tr key={carteira.id_carteira}>
              <td>{carteira.nome_carteira}</td>
              <td>{formatCurrency(carteira.saldo_total)}</td>
            </tr>
          ))}
          {carteiras.length === 0 && !loading && (
            <tr>
              <td colSpan="2" className={styles.empty}>
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
