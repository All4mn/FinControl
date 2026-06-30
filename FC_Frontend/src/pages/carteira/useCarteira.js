import { useState, useEffect } from "react";
import axios from "axios";
import { validarCarteira } from "./CarteiraSchema";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

const initialForm = {
  nome_carteira: "",
};

export const useCarteira = () => {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [carteiras, setCarteiras] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      } finally {
        setCarregando(false);
      }
    };

    fetchUsuario();
  }, []);

  useEffect(() => {
    if (!usuario) return;
    fetchCarteiras();
  }, [usuario]);

  const fetchCarteiras = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/carteiras/usuario/${usuario.id_usuario}`,
        {
          withCredentials: true,
        },
      );
      setCarteiras(response.data.dados || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.mensagem || "Erro ao carregar carteiras.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validarCarteira(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        await axios.put(
          `${API_BASE_URL}/carteiras/${editId}`,
          { ...formData },
          { withCredentials: true },
        );
      } else {
        await axios.post(
          `${API_BASE_URL}/carteiras`,
          { ...formData },
          { withCredentials: true },
        );
      }
      resetForm();
      await fetchCarteiras();
    } catch (err) {
      setError(err.response?.data?.mensagem || "Erro ao salvar carteira.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta carteira?")) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/carteiras/${id}`, {
        withCredentials: true,
      });
      await fetchCarteiras();
    } catch (err) {
      setError(err.response?.data?.mensagem || "Erro ao excluir carteira.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (carteira) => {
    setFormData({ nome_carteira: carteira.nome_carteira });
    setEditId(carteira.id_carteira);
    setError("");
  };

  return {
    usuario,
    carregando,
    carteiras,
    formData,
    editId,
    loading,
    error,
    handleChange,
    handleSubmit,
    handleDelete,
    handleEdit,
    resetForm,
  };
};
