import axios from "axios";
import { useState, useEffect } from "react";
import Header from "../../components/componentesPadrao/headerLogged/HeaderLogged.jsx";
import Footer from "../../components/componentesPadrao/footer/Footer.jsx";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  
  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [carteira, setCarteira] = useState(null);
  const [carteiraLoading, setCarteiraLoading] = useState(false);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value) || 0);

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

  useEffect(() => {
    const fetchCarteira = async () => {
      if (!usuario) return;
      setCarteiraLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/carteiras/usuario/${usuario.id_usuario}`,
          { withCredentials: true },
        );
        setCarteira(response.data.dados);
      } catch (err) {
        console.error("Erro ao carregar carteira:", err);
        setCarteira(null);
      } finally {
        setCarteiraLoading(false);
      }
    };

    fetchCarteira();
  }, [usuario]);

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
        <div className={styles.topSection}>
          <div className={styles.introCard}>
            <h1>Olá, {usuario?.nome_usuario}</h1>
            <p>Veja o resumo da sua carteira e seu saldo consolidado.</p>
          </div>
        </div>

        {usuario && (
          <div className={styles.carteiraCard}>
            <div className={styles.carteiraCardHeader}>
              <span className={styles.carteiraTitle}>
                Carteira do {usuario.nome_usuario}
              </span>
            </div>
            <div className={styles.carteiraCardBody}>
              <p className={styles.carteiraLabel}>Saldo consolidado</p>
              <p className={styles.carteiraSaldo}>
                {carteiraLoading
                  ? "Carregando..."
                  : carteira
                  ? formatCurrency(carteira.saldo_total)
                  : "R$ 0,00"}
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
