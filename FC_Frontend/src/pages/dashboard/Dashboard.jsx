import axios from "axios";
import { useState, useEffect } from "react";
import Header from "../../components/componentesPadrao/headerLogged/HeaderLogged.jsx";
import Footer from "../../components/componentesPadrao/footer/Footer.jsx";
import styles from "./Dashboard.module.css";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [idUsuario, setIdUsuario] = useState(localStorage.getItem("id_usuario"));
  const [nomeUsuario, setNomeUsuario] = useState(localStorage.getItem("nome_usuario"));
  const [emailUsuario, setEmailUsuario] = useState(localStorage.getItem("email_usuario"));

  useEffect(() => {
    // Verifica dados salvos no localStorage (compatível com login tradicional e Google)
    const usuarioData = localStorage.getItem("usuario");
    const currentIdUsuario = localStorage.getItem("id_usuario");
    const currentNomeUsuario = localStorage.getItem("nome_usuario");
    const currentEmailUsuario = localStorage.getItem("email_usuario");

    if (usuarioData) {
      // Formato antigo (login tradicional)
      const parsedData = JSON.parse(usuarioData);
      setUsuario(parsedData.dados);
    } else if (currentIdUsuario && currentNomeUsuario && currentEmailUsuario) {
      // Formato novo (login Google)
      setUsuario({
        id_usuario: currentIdUsuario,
        nome_usuario: currentNomeUsuario,
        email_usuario: currentEmailUsuario,
      });
    }

    // Atualiza os estados individuais
    setIdUsuario(currentIdUsuario);
    setNomeUsuario(currentNomeUsuario);
    setEmailUsuario(currentEmailUsuario);
  }, []);

  const handleLogout = () => {
    // Limpa localStorage
    localStorage.removeItem("usuario");
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("nome_usuario");
    localStorage.removeItem("email_usuario");

    // Limpa estados
    setUsuario(null);
    setIdUsuario(null);
    setNomeUsuario(null);
    setEmailUsuario(null);

    // Redireciona para login
    window.location.href = "/login";
  };

  return (
    <div className={styles.dashboard}>
      <Header />
      <h1>Dashboard</h1>

      {usuario && (
        <div className={styles.usuarioInfo}>
          <h2>Informações do Usuário</h2>
          <p>
            <strong>ID:</strong> {idUsuario}
          </p>
          <p>
              <strong>Nome:</strong> {nomeUsuario}
          </p>
          <p>
            <strong>Email:</strong> {emailUsuario}
          </p>
        </div>
      )}

      <Footer />
    </div>
  );
}
