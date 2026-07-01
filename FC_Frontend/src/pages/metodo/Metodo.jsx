import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/componentesPadrao/headerLogged/HeaderLogged.jsx";
import Footer from "../../components/componentesPadrao/footer/Footer.jsx";

const API_BASE_URL = import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

export default function Metodo() {
  const [metodos, setMetodos] = useState([]);
  const [formData, setFormData] = useState({ nome_metodo: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMetodos();
  }, []);

  const fetchMetodos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/metodos`, {
        withCredentials: true,
      });
      setMetodos(response.data.dados || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.mensagem || "Erro ao carregar métodos.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ nome_metodo: "" });
    setEditId(null);
    setError("");
  };

  const handleChange = (event) => {
    setFormData({ nome_metodo: event.target.value });
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.nome_metodo.trim()) {
      setError("O nome do método é obrigatório.");
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        await axios.put(
          `${API_BASE_URL}/metodos/${editId}`,
          { nome_metodo: formData.nome_metodo },
          { withCredentials: true },
        );
      } else {
        await axios.post(
          `${API_BASE_URL}/metodos`,
          { nome_metodo: formData.nome_metodo },
          { withCredentials: true },
        );
      }
      resetForm();
      await fetchMetodos();
    } catch (err) {
      setError(err.response?.data?.mensagem || "Erro ao salvar método.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (metodo) => {
    setFormData({ nome_metodo: metodo.nome_metodo });
    setEditId(metodo.id_metodo);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este método?")) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/metodos/${id}`, {
        withCredentials: true,
      });
      await fetchMetodos();
    } catch (err) {
      setError(err.response?.data?.mensagem || "Erro ao excluir método.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header logado={true} />
      <main style={{ flex: 1, maxWidth: 1040, margin: "0 auto", padding: 24 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 32 }}>Métodos de pagamento</h1>
          <p style={{ margin: "8px 0 0", color: "#555" }}>
            Cadastre os métodos usados nas transações e mantenha o controle dos pagamentos.
          </p>
        </div>

        {error && (
          <div style={{ marginBottom: 18, color: "#b12704", background: "#fceded", padding: 14, borderRadius: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginBottom: 26, display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr auto auto" }}>
            <input
              value={formData.nome_metodo}
              onChange={handleChange}
              placeholder="Nome do método"
              style={{ padding: 14, borderRadius: 18, border: "1px solid #cbd5e1", fontSize: 16 }}
              disabled={loading}
            />
            <button type="submit" disabled={loading} style={{ padding: "14px 18px", borderRadius: 18, border: "none", background: "#30c572", color: "#fff", cursor: "pointer" }}>
              {loading ? "Salvando..." : editId ? "Atualizar" : "Adicionar"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                style={{ padding: "14px 18px", borderRadius: 18, border: "1px solid #ccc", background: "#f3f4f6", color: "#111", cursor: "pointer" }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f8fafc" }}>
              <tr>
                <th style={{ padding: 16, textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>ID</th>
                <th style={{ padding: 16, textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Nome</th>
                <th style={{ padding: 16, textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {metodos.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: 16, textAlign: "center", color: "#64748b" }}>
                    Nenhum método cadastrado.
                  </td>
                </tr>
              ) : (
                metodos.map((metodo) => (
                  <tr key={metodo.id_metodo}>
                    <td style={{ padding: 16, borderBottom: "1px solid #e2e8f0" }}>{metodo.id_metodo}</td>
                    <td style={{ padding: 16, borderBottom: "1px solid #e2e8f0" }}>{metodo.nome_metodo}</td>
                    <td style={{ padding: 16, borderBottom: "1px solid #e2e8f0", display: "flex", gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => handleEdit(metodo)}
                        style={{ padding: "10px 16px", borderRadius: 16, border: "none", background: "#2563eb", color: "white", cursor: "pointer" }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(metodo.id_metodo)}
                        style={{ padding: "10px 16px", borderRadius: 16, border: "none", background: "#f8fafc", color: "#111", cursor: "pointer" }}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}
