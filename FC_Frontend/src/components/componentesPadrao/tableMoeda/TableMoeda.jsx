import React from "react";
import styles from "./tableMoeda.module.css";

export default function TableMoeda({
  moedas, carregandoLista, erroLista,
  editandoId, editandoValor, salvando,
  iniciarEdicao, cancelarEdicao, handleEditChange, salvarEdicao,
  deletandoId, deletarMoeda
}) {
  return (
    <section className={styles.cardList}>
      <div className={styles.cabecalhoLista}>
        <h2 className={styles.subtitulo}>Moedas cadastradas</h2>
        <span className={styles.contador}>{moedas.length}</span>
      </div>

      {erroLista && <div className={styles.erro}>{erroLista}</div>}

      {carregandoLista ? (
        <div className={styles.listaCarregando}>
          <span className={styles.spinnerEscuro} />
        </div>
      ) : moedas.length === 0 ? (
        <p className={styles.vazio}>Nenhuma moeda cadastrada no momento.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th className={styles.th}>Nome da Moeda</th>
                <th className={styles.thAcoes}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {moedas.map((moeda) => (
                <tr key={moeda.id_moeda} className={styles.tr}>
                  <td className={styles.td}>
                    {editandoId === moeda.id_moeda ? (
                      <input
                        type="text"
                        value={editandoValor}
                        onChange={handleEditChange}
                        autoComplete="off"
                        className={styles.inputInline}
                      />
                    ) : (
                      moeda.nome_moeda
                    )}
                  </td>
                  <td className={styles.tdAcoes}>
                    <div className={styles.acoes}>
                      {editandoId === moeda.id_moeda ? (
                        <>
                          <button onClick={() => salvarEdicao(moeda.id_moeda)} disabled={salvando} className={styles.btnSalvar} title="Salvar">
                            {salvando ? <span className={styles.spinnerPequeno} /> : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            )}
                          </button>
                          <button onClick={cancelarEdicao} disabled={salvando} className={styles.btnCancelar} title="Cancelar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => iniciarEdicao(moeda)} className={styles.btnEditar} title="Editar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                          </button>
                          <button onClick={() => deletarMoeda(moeda.id_moeda)} disabled={deletandoId === moeda.id_moeda} className={styles.btnDeletar} title="Remover">
                            {deletandoId === moeda.id_moeda ? <span className={styles.spinnerPequenoErro} /> : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}