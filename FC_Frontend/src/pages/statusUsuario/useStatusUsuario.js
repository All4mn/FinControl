import { useState, useEffect } from "react";
import axios from "axios";
import { validarStatusUsuario } from "./StatusUsuarioSchema";

const API_BASE_URL = import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

export const useStatusUsuario = () => {
  const [statusList, setStatusList] = useState([]);
  const [formData, setFormData] = useState({ nome_status_usuario: "" });
  const [editId, setEditId] = useState(null); // null = criação, número = edição
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Carregar todos os status ao montar
  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/status-usuario`, {
        withCredentials: true,
      });
      setStatusList(response.data.dados || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.mensagem || "Erro ao carregar status.");
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
    setFormData({ nome_status_usuario: "" });
    setEditId(null);
  };

  // Envia para criação ou atualização
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMsg = validarStatusUsuario(formData);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        // Atualizar
        await axios.put(
          `${API_BASE_URL}/status-usuario/${editId}`,
          { nome_status_usuario: formData.nome_status_usuario },
          { withCredentials: true }
        );
      } else {
        // Criar
        await axios.post(
          `${API_BASE_URL}/status-usuario`,
          { nome_status_usuario: formData.nome_status_usuario },
          { withCredentials: true }
        );
      }
      resetForm();
      await fetchStatus(); // recarrega a lista
    } catch (err) {
      setError(err.response?.data?.mensagem || "Erro ao salvar status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este status?")) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/status-usuario/${id}`, {
        withCredentials: true,
      });
      await fetchStatus();
    } catch (err) {
      setError(err.response?.data?.mensagem || "Erro ao excluir status.");
    } finally {
      setLoading(false);
    }
  };

  // Carrega um status para edição
  const handleEdit = (status) => {
    setFormData({ nome_status_usuario: status.nome_status_usuario });
    setEditId(status.id_status_usuario);
  };

  return {
    statusList,
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