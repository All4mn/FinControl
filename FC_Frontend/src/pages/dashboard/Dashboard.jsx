import axios from "axios";
import { useState, useEffect } from "react";
import Header from "../../components/componentesPadrao/headerLogged/HeaderLogged.jsx";
import Footer from "../../components/componentesPadrao/footer/Footer.jsx";
import styles from "./Dashboard.module.css";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Verifica dados salvos no localStorage (compatível com login tradicional e Google)
    const usuarioData = localStorage.getItem("usuario");
    const idUsuario = localStorage.getItem("id_usuario");
    const nomeUsuario = localStorage.getItem("nome_usuario");
    const emailUsuario = localStorage.getItem("email_usuario");

    if (usuarioData) {
      // Formato antigo (login tradicional)
      const parsedData = JSON.parse(usuarioData);
      setUsuario(parsedData.dados);
    } else if (idUsuario && nomeUsuario && emailUsuario) {
      // Formato novo (login Google)
      setUsuario({
        id_usuario: idUsuario,
        nome_usuario: nomeUsuario,
        email_usuario: emailUsuario,
      });
    }
  }, []);

  return (
    <div className={styles.dashboard}>
      <Header />
      <h1>Dashboard</h1>

      {usuario && (
        <div className={styles.usuarioInfo}>
          <h2>Informações do Usuário</h2>
          <p>
            <strong>ID:</strong> {usuario.id_usuario}
          </p>
          <p>
            <strong>Nome:</strong> {usuario.nome_usuario}
          </p>
          <p>
            <strong>Email:</strong> {usuario.email_usuario}
          </p>
        </div>
      )}

      <Footer />
    </div>
  );
}
