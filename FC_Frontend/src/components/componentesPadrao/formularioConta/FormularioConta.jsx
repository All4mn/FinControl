import React from "react";
import styles from "./FormularioConta.module.css";
const FormularioConta = ({postConta, setContaInfos, contaInfos}) => {
  return (
    <div className={styles.popup}>
      <div>
        <header>
          <h1>Crie sua nova conta</h1>
        </header>
        <section>
            <form action="" onSubmit={(e)=>postConta(e)}>

          <div>
            <input type="text" placeholder="Nome da conta" onChange={(e)=>setContaInfos({...contaInfos, nome_conta: e.target.value})} />
          </div>
          <div>
            <select name="" id="" onChange={(e)=>{setContaInfos({...contaInfos, id_moeda:Number(e.target.value)});console.log(contaInfos.moeda);
            }}>
              <option value="">selecione uma moeda</option>
              <option value="1">Real</option>
              <option value="2">Dolar</option>
            </select>
            <input type="text" placeholder="Saldo" onChange={(e)=>setContaInfos({...contaInfos, saldo_conta: Number(e.target.value)})} />
          </div>
          <footer>
            <button type="submit">Criar nova conta</button>
          </footer>
            </form>
        </section>
      </div>
    </div>
  );
};

export default FormularioConta;
