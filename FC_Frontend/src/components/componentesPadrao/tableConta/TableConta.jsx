import React from "react";
//import styles from './TableConta.module.css'
const TableConta = (conta) => {
  return (
    <div>
      {conta.conta ? (
        <>
          {conta.conta.map((conta) => (
            <div key={conta.id_conta}>
              <p>{conta.nome_conta}</p>
              <p>{conta.moeda}</p>
              <p>
                {/* formatação insana q eu achei na net */}
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(conta.saldo_conta)}
              </p>
            </div>
          ))}
        </>
      ) : (
        <>Crie sua primeira conta agora!</>
      )}

      <button
        onClick={() => {
          console.log(conta.conta);
        }}
      >
        verificar conta
      </button>
    </div>
  );
};

export default TableConta;
