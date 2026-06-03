import React from 'react'
import styles from './TableLog.module.css'
import dayjs from 'dayjs'
const TableLog = (logs) => {
  return (
    <div className={styles.container}>
        <div className={styles.table_container}>

        {/* {logs.logs.map((log) => (
            <>
            <ul className={styles.tabela}>
            
            <li key={log.id_log} className={styles.linha}>
                <p>ID: {log.id_log}</p>
                <p>Operação: {log.operacao}</p>
                <p>Conta: {log.nome_conta}</p>
                <p>Carteira: {log.nome_carteira}</p>
                <p>Categoria: {log.nome_categoria}</p>
            </li>
            </ul>
            </>
        ))} */}

        <table className={styles.tabela}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Operação</th>
                    <th>Conta</th>
                    <th>Carteira</th>
                    <th>Categoria</th>
                    <th>Descrição</th>
                    <th>Descrição Antes</th>
                    <th>Valor</th>
                    <th>Valor Antes</th>
                    <th>Entrada</th>
                    <th>Entrada Antes</th>
                    <th>Arquivado</th>
                    <th>Arquivado Antes</th>
                    <th>Quitado</th>
                    <th>Data Transação</th>
                    <th>Data Antes</th>
                    <th>Data Log</th>

                </tr>
            </thead>
            <tbody>
                {logs.logs.map((log) => (
                    <tr key={log.id_log} className={styles.linha}>
                        <td>{log.id_log}</td>
                        <td>{log.operacao}</td>
                        <td>{log.nome_conta}</td>
                        <td>{log.nome_carteira}</td>
                        <td>{log.nome_categoria}</td>
                        <td>{log.descricao}</td>
                        <td>{log.descricao_antes || 'N/A'}</td>
                        <td>{log.valor}</td>
                        <td>{log.valor_antes !== null ? log.valor_antes : 'N/A'}</td>
                        <td>{log.entrada ? 'Sim' : 'Não'}</td>
                        <td>{log.entrada_antes !== null ? (log.entrada_antes ? 'Sim' : 'Não') : 'N/A'}</td>
                        <td>{log.arquivado ? 'Sim' : 'Não'}</td>
                        <td>{log.arquivado_antes !== null ? (log.arquivado_antes ? 'Sim' : 'Não') : 'N/A'}</td>
                        <td>{log.quitado ? 'Sim' : 'Não'}</td>
                        <td>{log.data_transacao ? dayjs(log.data_transacao).format('DD/MM/YYYY HH:mm:ss') : 'N/A'}</td>
                        <td>{log.data_antes ? dayjs(log.data_antes).format('DD/MM/YYYY HH:mm:ss') : 'N/A'}</td>
                        <td>{log.data_log ? dayjs(log.data_log).format('DD/MM/YYYY HH:mm:ss') : 'N/A'}</td>

                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    </div>
  )
}

export default TableLog