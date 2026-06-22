import React from "react";
import styles from './TableConta.module.css'
const TableConta = ({conta}) => {
  const [contasState, setContasState] = React.useState({});
 
  const toggleApagar = (id) => {
    setContasState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        inativa: !prev[id]?.inativa,
        editando: false,
      },
    }));
  };
 
  const toggleEditar = (id) => {
    setContasState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        editando: !prev[id]?.editando,
      },
    }));
  };
 
  const handleNomeChange = (id, valor) => {
    setContasState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        nomeEditado: valor,
      },
    }));
  };
 
  if (!conta || conta.length === 0) {
    return (
      <div className={styles.vazio}>
        <span>🏦</span>
        Crie sua primeira conta agora!
      </div>
    );
  }
 
  return (
    <>
      {conta.map((item) => {
        const estado = contasState[item.id_conta] || {};
        const inativa = !!estado.inativa;
        const editando = !!estado.editando && !inativa;
        const nomeAtual =
          estado.nomeEditado !== undefined ? estado.nomeEditado : item.nome_conta;
 
        return (
          <div
            key={item.id_conta}
            className={`${styles.card} ${inativa ? styles.card_inativa : ""}`}
          >
            {/* ── Topo: nome + ações ── */}
            <div className={styles.card_header}>
              {editando ? (
                <input
                  className={styles.input_nome}
                  value={nomeAtual}
                  onChange={(e) => handleNomeChange(item.id_conta, e.target.value)}
                  autoFocus
                />
              ) : (
                <p
                  className={`${styles.nome_conta} ${inativa ? styles.nome_conta_inativa : ""}`}
                >
                  {nomeAtual}
                </p>
              )}
 
              <div className={styles.acoes}>
                {!inativa && (
                  <button
                    className={`${styles.btn_icone} ${styles.btn_editar} ${editando ? styles.btn_editar_ativo : ""}`}
                    onClick={() => toggleEditar(item.id_conta)}
                    title={editando ? "Confirmar edição" : "Editar nome"}
                    aria-label={editando ? "Confirmar edição" : "Editar nome da conta"}
                  >
                    {/* ícone lápis / check dependendo do estado */}
                    {editando ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    )}
                  </button>
                )}
 
                {inativa ? (
                  <button
                    className={`${styles.btn_icone} ${styles.btn_reativar}`}
                    onClick={() => toggleApagar(item.id_conta)}
                    title="Reativar conta"
                    aria-label="Reativar conta"
                  >
                    {/* ícone reativar (seta circular) */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                    </svg>
                  </button>
                ) : (
                  <button
                    className={`${styles.btn_icone} ${styles.btn_apagar}`}
                    onClick={() => toggleApagar(item.id_conta)}
                    title="Apagar conta"
                    aria-label="Apagar conta"
                  >
                    {/* ícone lixeira */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
 
            {/* ── Corpo: moeda · saldo ── */}
            <div className={styles.card_body}>
              <span className={`${styles.moeda} ${inativa ? styles.moeda_inativa : ""}`}>
                {item.moeda || "BRL"}
              </span>
              <span className={styles.separador}>·</span>
              <span className={`${styles.saldo} ${inativa ? styles.saldo_inativa : ""}`}>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(item.saldo_conta)}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default TableConta;
