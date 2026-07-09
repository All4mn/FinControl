import React from "react";
import styles from "./TableCarteira.module.css";

const TableCarteira = ({ carteiras, loading }) => {
  const formatCurrency = (value, currency = "BRL") => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
    }).format(Number(value) || 0);
  };

  const getCurrencyCode = (nome_moeda) => {
    const name = String(nome_moeda || "").toLowerCase();
    if (name.includes("euro")) return "EUR";
    if (name.includes("dólar") || name.includes("dolar") || name.includes("usd")) return "USD";
    if (name.includes("real") || name.includes("brl")) return "BRL";
    return "BRL";
  };

  const rows = carteiras.flatMap((carteira) => {
    if (carteira.saldos && carteira.saldos.length > 0) {
      return carteira.saldos.map((saldo, index) => ({
        id: `${carteira.id_carteira}-${saldo.id_moeda ?? index}`,
        nome_carteira: carteira.nome_carteira,
        nome_moeda: saldo.nome_moeda,
        saldo_total: saldo.saldo_total,
      }));
    }

    return [
      {
        id: carteira.id_carteira,
        nome_carteira: carteira.nome_carteira,
        nome_moeda: "Sem moeda",
        saldo_total: carteira.saldo_total || 0,
      },
    ];
  });

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Moeda</th>
            <th>Saldo consolidado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.nome_carteira}</td>
              <td>{row.nome_moeda}</td>
              <td>{formatCurrency(row.saldo_total, getCurrencyCode(row.nome_moeda))}</td>
            </tr>
          ))}
          {rows.length === 0 && !loading && (
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
