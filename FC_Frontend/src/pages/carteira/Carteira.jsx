import React from "react";
import Header from "../../components/componentesPadrao/headerLogged/HeaderLogged.jsx";
import Footer from "../../components/componentesPadrao/footer/Footer.jsx";
import TableCarteira from "../../components/componentesPadrao/tableCarteira/TableCarteira.jsx";
import styles from "./Carteira.module.css";
import { useCarteira } from "./useCarteira";

export default function Carteira() {
  const { usuario, carregando, error, carteiras, loading } = useCarteira();

  if (carregando) {
    return (
      <div className={styles.page}>
        <Header usuario={{ nome_usuario: "Carregando..." }} logado={true} />
        <main className={styles.main}>
          <p>Carregando suas carteiras...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header usuario={usuario} logado={true} />
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.headerCard}>
            <div>
              <h1 className={styles.titulo}>Carteira</h1>
              <p className={styles.descricao}>
                Visualize o saldo consolidado das suas contas e gerencie a sua
                carteira única de usuário.
              </p>
            </div>
          </div>

          {error && <div className={styles.erro}>{error}</div>}

          {carteiras.length === 0 && !loading ? (
            <div className={styles.emptyMessage}>
              Você ainda não possui uma carteira registrada. Crie sua primeira conta para gerar automaticamente sua carteira.
            </div>
          ) : (
            <TableCarteira
              carteiras={carteiras}
              loading={loading}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
