import React from "react";
import styles from "./FormularioConta.module.css";

const FormularioConta = ({ postConta, setContaInfos, contaInfos, onFechar, moeda }) => {
  return (
    <div className={styles.card}>

      {/* ── Cabeçalho ── */}
      <header className={styles.header}>
        <h2 className={styles.titulo}>Crie sua nova conta</h2>
        <button
          className={styles.btn_fechar}
          onClick={onFechar}
          type="button"
          aria-label="Fechar formulário"
        >
          {/* X */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>

      {/* ── Formulário ── */}
      <form onSubmit={(e) => postConta(e)} className={styles.form}>

        <input
          className={styles.input}
          type="text"
          placeholder="Nome da conta"
          value={contaInfos.nome_conta}
          onChange={(e) => setContaInfos({ ...contaInfos, nome_conta: e.target.value })}
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
            moeda.map((moeda)=>(
            <option key={moeda.id_moeda} value={moeda.id_moeda} >{moeda.nome_moeda}</option>
           ))}
          </select>

          <input
            className={`${styles.input} ${styles.input_saldo}`}
            type="number"
            placeholder="Saldo inicial"
            value={contaInfos.saldo_conta}
            onChange={(e) => setContaInfos({ ...contaInfos, saldo_conta: Number(e.target.value) })}
            required
          />
        </div>

        {/* ── Botão confirmar (ícone ✓ circular) ── */}
        <div className={styles.footer}>
          <button type="submit" className={styles.btn_submit} aria-label="Criar conta">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>

      </form>
    </div>
  );
};

export default FormularioConta;