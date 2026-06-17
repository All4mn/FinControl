import React, { useState, useMemo } from "react";
import styles from "./TableLog.module.css";
import dayjs from "dayjs";

const formatData = (val) =>
  val ? dayjs(val).format("DD/MM/YYYY HH:mm") : null;

const NA = <span className={styles.tdNa}>—</span>;

const BadgeOp = ({ op }) => {
  const cls = op === "INSERT" ? styles.badgeInsert : styles.badgeUpdate;
  return <span className={cls}>{op}</span>;
};

const BadgeBool = ({ val }) =>
  val == null ? (
    NA
  ) : (
    <span className={val ? styles.badgeSim : styles.badgeNao}>
      {val ? "Sim" : "Não"}
    </span>
  );

const TdAntes = ({ children }) =>
  children == null ? (
    <td className={`${styles.tdAntes} ${styles.tdNa}`}>—</td>
  ) : (
    <td className={styles.tdAntes}>{children}</td>
  );

const ThSort = ({ campo, atual, direcao, onClick, children }) => {
  const cls =
    atual === campo
      ? direcao === "asc"
        ? styles.thAsc
        : styles.thDesc
      : styles.thSortable;
  return (
    <th className={cls} onClick={() => onClick(campo)}>
      {children}
    </th>
  );
};

const TableLog = ({ logs }) => {
  const [filtroOp, setFiltroOp] = useState("TODOS");
  const [sortCampo, setSortCampo] = useState("id_log");
  const [sortDir, setSortDir] = useState("desc");
  const [filtroIdTransacao, setFiltroIdTransacao] = useState("");

  const handleSort = (campo) => {
    if (sortCampo === campo) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCampo(campo);
      setSortDir("asc");
    }
  };

  const dadosFiltrados = useMemo(() => {
    let lista =
      filtroOp === "TODOS" ? logs : logs.filter((l) => l.operacao === filtroOp);
    if (filtroIdTransacao.trim() !== "") {
      lista = lista.filter((l) =>
        String(l.id_transacao ?? "").includes(filtroIdTransacao.trim()),
      );
    }
    lista = [...lista].sort((a, b) => {
      let va = a[sortCampo] ?? "";
      let vb = b[sortCampo] ?? "";
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return lista;
  }, [logs, filtroOp, sortCampo, sortDir, filtroIdTransacao]);

  if (!logs || logs.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.vazio}>Nenhum log encontrado.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.table_container}>
        <div className={styles.toolbar}>
          <label>
            Pesquisar por Id transação
            <input
            className={styles.id_transacao_label}
              type="text"
              placeholder="Buscar por ID..."
              value={filtroIdTransacao}
              onChange={(e) => setFiltroIdTransacao(e.target.value)}
            />
          </label>
          <label>
            Operação
            <select
              value={filtroOp}
              onChange={(e) => setFiltroOp(e.target.value)}
            >
              <option value="TODOS">Todos</option>
              <option value="INSERT">INSERT</option>
              <option value="UPDATE">UPDATE</option>
            </select>
          </label>
          <span className={styles.contador}>
            {dadosFiltrados.length} de {logs.length} registros
          </span>
        </div>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <ThSort
                campo="id_log"
                atual={sortCampo}
                direcao={sortDir}
                onClick={handleSort}
              >
                ID
              </ThSort>
              <ThSort
                campo="id_transacao"
                atual={sortCampo}
                direcao={sortDir}
                onClick={handleSort}
              >
                Id transação
              </ThSort>
              <ThSort
                campo="operacao"
                atual={sortCampo}
                direcao={sortDir}
                onClick={handleSort}
              >
                Operação
              </ThSort>
              <ThSort
                campo="nome_conta"
                atual={sortCampo}
                direcao={sortDir}
                onClick={handleSort}
              >
                Conta
              </ThSort>
              <ThSort
                campo="nome_carteira"
                atual={sortCampo}
                direcao={sortDir}
                onClick={handleSort}
              >
                Carteira
              </ThSort>
              <ThSort
                campo="nome_categoria"
                atual={sortCampo}
                direcao={sortDir}
                onClick={handleSort}
              >
                Categoria
              </ThSort>
              <ThSort
                campo="descricao"
                atual={sortCampo}
                direcao={sortDir}
                onClick={handleSort}
              >
                Descrição
              </ThSort>
              <th>Descrição antes</th>
              <ThSort
                campo="valor"
                atual={sortCampo}
                direcao={sortDir}
                onClick={handleSort}
              >
                Valor
              </ThSort>
              <th>Valor antes</th>
              <th>Entrada</th>
              <th>Entrada antes</th>
              <th>Arquivado</th>
              <th>Arquivado antes</th>
              <th>Quitado</th>
              <ThSort
                campo="data_transacao"
                atual={sortCampo}
                direcao={sortDir}
                onClick={handleSort}
              >
                Data transação
              </ThSort>
              <ThSort
                campo="data_log"
                atual={sortCampo}
                direcao={sortDir}
                onClick={handleSort}
              >
                Data log
              </ThSort>
            </tr>
          </thead>
          <tbody>
            {dadosFiltrados.map((log) => (
              <tr key={log.id_log}>
                <td>{log.id_log}</td>
                <td>{log.id_transacao}</td>
                <td>
                  <BadgeOp op={log.operacao} />
                </td>
                <td>{log.nome_conta ?? NA}</td>
                <td>{log.nome_carteira ?? NA}</td>
                <td>{log.nome_categoria ?? NA}</td>
                <td>{log.descricao}</td>
                <TdAntes>{log.descricao_antes ?? null}</TdAntes>
                <td>R$ {Number(log.valor).toFixed(2)}</td>
                <TdAntes>
                  {log.valor_antes != null
                    ? `R$ ${Number(log.valor_antes).toFixed(2)}`
                    : null}
                </TdAntes>
                <td>
                  <BadgeBool val={log.entrada} />
                </td>
                <TdAntes>
                  <BadgeBool val={log.entrada_antes} />
                </TdAntes>
                <td>
                  <BadgeBool val={log.arquivado} />
                </td>
                <TdAntes>
                  <BadgeBool val={log.arquivado_antes} />
                </TdAntes>
                <td>
                  <BadgeBool val={log.quitado} />
                </td>
                <td>{formatData(log.data_transacao) ?? NA}</td>
                <td>{formatData(log.data_log) ?? NA}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableLog;
