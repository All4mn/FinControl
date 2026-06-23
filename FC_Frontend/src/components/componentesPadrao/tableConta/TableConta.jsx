import React from "react";
import styles from './TableConta.module.css'

const TableConta = ({ conta, archiveConta, desarchiveConta, updateConta }) => {
  const [contasState, setContasState] = React.useState({});
  const [update, setUpdate] = React.useState("");

  const toggleEditar = (id) => {
    setContasState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        editando: !prev[id]?.editando,
      },
    }));
  };

  const cancelarEditar = (id) => {
    setContasState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        editando: false,
      },
    }));
    setUpdate("");
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
        const inativa = item.ativo === "false";
        const editando = !!estado.editando && !inativa;

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
                  value={update}
                  onChange={(e) => setUpdate(e.target.value)}
                  autoFocus
                />
              ) : (
                <p className={`${styles.nome_conta} ${inativa ? styles.nome_conta_inativa : ""}`}>
                  {item.nome_conta}
                </p>
              )}

              <div className={styles.acoes}>
                {!inativa && (
                  <>
                    {/* ── Confirmar (✓) ou Editar (lápis) ── */}
                    <button
                      className={`${styles.btn_icone} ${editando ? styles.btn_editar_ativo : ""}`}
                      onClick={() => {
                        if (editando) {
                          updateConta(update, item.id_conta);
                          toggleEditar(item.id_conta);
                        } else {
                          setUpdate(item.nome_conta);
                          toggleEditar(item.id_conta);
                        }
                      }}
                      title={editando ? "Confirmar edição" : "Editar nome"}
                      aria-label={editando ? "Confirmar edição" : "Editar nome da conta"}
                    >
                      {editando ? (
                        // ✓ check
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        // lápis
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      )}
                    </button>

                    {/* ── Cancelar (X) — só aparece durante edição ── */}
                    {editando && (
                      <button
                        className={`${styles.btn_icone} ${styles.btn_cancelar}`}
                        onClick={() => cancelarEditar(item.id_conta)}
                        title="Cancelar edição"
                        aria-label="Cancelar edição"
                      >
                        {/* X */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}

                    {/* ── Lixeira — some durante edição ── */}
                    {!editando && (
                      <button
                        className={`${styles.btn_icone} ${styles.btn_apagar}`}
                        onClick={() => archiveConta(item.id_conta)}
                        title="Arquivar conta"
                        aria-label="Arquivar conta"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    )}
                  </>
                )}

                {/* ── Reativar — só aparece quando inativa ── */}
                {inativa && (
                  <button
                    className={`${styles.btn_icone} ${styles.btn_reativar}`}
                    onClick={() => desarchiveConta(item.id_conta)}
                    title="Reativar conta"
                    aria-label="Reativar conta"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
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