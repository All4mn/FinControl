import axios from "axios";
import { useState, useEffect } from "react";
import Header from "../../components/componentesPadrao/headerLogged/HeaderLogged.jsx";
import Footer from "../../components/componentesPadrao/footer/Footer.jsx";
import styles from "./Dashboard.module.css";
import Categoria from "../../components/categoria/Categoria.jsx";
import Categoria_adm from "../../components/categoria/Categoria_adm.jsx";

export default function Dashboard() {
  
  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        console.log(API_BASE_URL);
        const response = await axios.get(`${API_BASE_URL}/usuarios/me`, {
          withCredentials: true,
        });

        if (response.data.sucesso) {
          setUsuario(response.data.dados);
        } else {
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
        window.location.href = "/login";
      } finally {
        setCarregando(false);
      }
    };

    fetchUsuario();
  }, []);

  if (carregando) {
    return (
      <div className={styles.dashboard}>
        <Header usuario={null} logado={true} />
        <main className={styles.main}>
          <p>Carregando informações do usuário...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <Header usuario={usuario} logado={true} />
      <main className={styles.main}>
        <h1>Dashboard</h1>
        {usuario && (
          <div className={styles.usuarioInfo}>
            <h2>Olá, {usuario.nome_usuario}</h2>
            <Categoria />
            <Categoria_adm />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
