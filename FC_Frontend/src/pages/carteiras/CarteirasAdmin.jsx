import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../../components/componentesPadrao/headerLogged/HeaderLogged.jsx";
import Footer from "../../components/componentesPadrao/footer/Footer.jsx";
import styles from "./CarteirasAdmin.module.css";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

export default function CarteirasAdmin() {
  const [usuario, setUsuario] = useState(null);
  const [carteiras, setCarteiras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
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
      }
    };

    fetchUsuario();
  }, []);

  useEffect(() => {
    if (!usuario) return;

    const fetchCarteiras = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/carteiras/all`, {
          withCredentials: true,
        });
        setCarteiras(response.data.dados || []);
        setError("");
      } catch (err) {
        setError(err.response?.data?.mensagem || "Erro ao carregar carteiras.");
      } finally {
        setLoading(false);
      }
    };

    fetchCarteiras();
  }, [usuario]);

  const startEditing = (carteira) => {
    setEditingId(carteira.id_carteira);
    setEditingName(carteira.nome_carteira);
    setError("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
    setError("");
  };

  const saveEditing = async (id) => {
    if (!editingName.trim()) {
      setError("O nome da carteira não pode ficar em branco.");
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/carteiras/admin/${id}`,
        { nome_carteira: editingName },
        { withCredentials: true },
      );

      setCarteiras((prev) =>
        prev.map((item) =>
          item.id_carteira === id
            ? { ...item, nome_carteira: response.data.dados.nome_carteira }
            : item,
        ),
      );
      cancelEditing();
    } catch (err) {
      setError(err.response?.data?.mensagem || "Erro ao atualizar a carteira.");
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value) || 0);

  return (
    <div className={styles.page}>
      <Header usuario={usuario} logado={true} />
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.headerCard}>
            <div>
              <h1 className={styles.titulo}>Admin de Carteiras</h1>
              <p className={styles.descricao}>
                Visualize todas as carteiras cadastradas e os usuários vinculados.
              </p>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Carteira</th>
                  <th>Usuário</th>
                  <th>Email</th>
                  <th>Saldo consolidado</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className={styles.loading}>
                      Carregando carteiras...
                    </td>
                  </tr>
                ) : carteiras.length === 0 ? (
                  <tr>
                    <td colSpan="5" className={styles.empty}>
                      Nenhuma carteira encontrada.
                    </td>
                  </tr>
                ) : (
                  carteiras.map((carteira) => (
                    <tr key={carteira.id_carteira}>
                      <td>
                        {editingId === carteira.id_carteira ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                          />
                        ) : (
                          carteira.nome_carteira
                        )}
                      </td>
                      <td>{carteira.nome_usuario}</td>
                      <td>{carteira.email_usuario}</td>
                      <td>{formatCurrency(carteira.saldo_total)}</td>
                      <td>
                        {editingId === carteira.id_carteira ? (
                          <>
                            <button
                              type="button"
                              className={styles.btnSave}
                              onClick={() => saveEditing(carteira.id_carteira)}
                            >
                              Salvar
                            </button>
                            <button
                              type="button"
                              className={styles.btnCancel}
                              onClick={cancelEditing}
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className={styles.btnEdit}
                            onClick={() => startEditing(carteira)}
                          >
                            Editar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
