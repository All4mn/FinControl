import React from "react";
import axios from "axios"; // Adicionado pois é usado no fetchCarteiraHasConta
import Header from "../../components/componentesPadrao/header/Header";
import Footer from "../../components/componentesPadrao/footer/Footer";
import styles from "./CarteiraHasConta.module.css";
import { useCarteiraHasConta } from "./useCarteiraHasConta";
// Importe o seu TableLog aqui caso ele esteja em outro arquivo, ex:
// import TableLog from "../../components/TableLog";

const API_BASE_URL = "http://localhost:5173";

const CarteiraHasConta = () => {
  const [carteiraHasConta, setCarteiraHasConta] = React.useState([]);
  
  // 1. Chamada do Custom Hook para gerenciar o formulário de cadastro
  const { formData, loading, error, handleChange, handleSubmit } = useCarteiraHasConta();

  React.useEffect(() => {
    fetchCarteiraHasConta();
  }, []);

  // 2. Busca os dados existentes para alimentar a tabela
  const fetchCarteiraHasConta = async () => {
    try {
      console.log(API_BASE_URL);
      const response = await axios.get(`${API_BASE_URL}/CarteiraHasConta`);
      console.log(response.data.dados);
      setCarteiraHasConta(response.data.dados);

      if (!response.data) {
        throw new Error("Erro ao carregar CarteiraHasConta");
      }
    } catch (error) {
      console.error("Erro ao carregar CarteiraHasConta:", error);
    }
  };

  return (
    <div className={styles.fullWindow}>
      <Header logado={true} />
      
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>CarteiraHasConta</h1>
        </div>

        {/* Layout estruturado para exibir o Formulário e a Tabela lado a lado ou empilhados */}
        <div className={styles.contentLayout}>
          
          {/* COLUNA/SEÇÃO DO FORMULÁRIO */}
          <div className={styles.card}>
            <h2 className={styles.subTitulo}>Novo Vínculo</h2>
            
            {error && <div className={styles.erro}>{error}</div>}
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="id_carteira">ID da Carteira</label>
                <input 
                  id="id_carteira"
                  name="id_carteira" 
                  type="number"
                  placeholder="Ex: 1"
                  value={formData.id_carteira} 
                  onChange={handleChange} 
                  className={styles.input} 
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="id_conta">ID da Conta</label>
                <input 
                  id="id_conta"
                  name="id_conta" 
                  type="number"
                  placeholder="Ex: 3"
                  value={formData.id_conta} 
                  onChange={handleChange} 
                  className={styles.input} 
                />
              </div>

              <button type="submit" disabled={loading} className={styles.btn}>
                {loading ? "Processando..." : "Criar Vínculo"}
              </button>
            </form>
          </div>

          {/* COLUNA/SEÇÃO DA TABELA DE LOGS */}
          <section className={styles.tableSection}>
            <h2 className={styles.subTitulo}>Vínculos Existentes</h2>
            
            <TableLog logs={carteiraHasConta} />
            
            <button 
              className={styles.debugBtn} 
              onClick={() => console.log(carteiraHasConta)}
            >
              Visualizar Log no Console
            </button>
          </section>

        </div>
      </div>

      <footer className={styles.footer}>
        <Footer />
      </footer>
    </div>
  );
};

export default CarteiraHasConta;