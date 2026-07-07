import React from "react";
import styles from "./FormularioConta.module.css";

const FormularioConta = ({ postConta, setContaInfos, contaInfos, moeda, carregando, erro, sucesso }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.titulo}>Criar conta</h2>

      {erro && <div className={styles.erro}>{erro}</div>}
      {sucesso && <div className={styles.sucesso}>{sucesso}</div>}

      <form onSubmit={(e) => postConta(e)} className={styles.form}>
        <input
          className={styles.input}
          type="text"
          placeholder="Nome da conta"
          value={contaInfos.nome_conta}
          onChange={(e) => setContaInfos({ ...contaInfos, nome_conta: e.target.value })}
          autoComplete="off"
          required
        />

        <div className={styles.row}>
          <select
            className={`${styles.input} ${styles.select}`}
            value={contaInfos.id_moeda}
            onChange={(e) => setContaInfos({ ...contaInfos, id_moeda: Number(e.target.value) })}
            required
          >
            <option value="">Selecione uma moeda</option>
            {moeda &&
              moeda.map((m) => (
                <option key={m.id_moeda} value={m.id_moeda}>{m.nome_moeda}</option>
              ))}
          </select>

          <input
            className={`${styles.input} ${styles.input_saldo}`}
            type="number"
            placeholder="Saldo inicial"
            value={contaInfos.saldo_conta}
            onChange={(e) => setContaInfos({ ...contaInfos, saldo_conta: Number(e.target.value) })}
            autoComplete="off"
            required
          />
        </div>

        <button type="submit" disabled={carregando} className={styles.btn}>
          {carregando ? <span className={styles.spinner} /> : "Criar conta"}
        </button>
      </form>
    </div>
  );
};

export default FormularioConta;
