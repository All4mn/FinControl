import Header from "../../components/componentesPadrao/headerLogged/HeaderLogged.jsx";
import Footer from "../../components/componentesPadrao/footer/Footer.jsx";
import Categoria from "../../components/categoria/Categoria.jsx";
import Categoria_adm from "../../components/categoria_adm/Categoria_adm.jsx";
import styles from "./CategoriaPage.module.css";

export default function CategoriaPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>Categorias</h1>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Visualização</h2>
            <Categoria />
          </div>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Administração</h2>
            <Categoria_adm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
