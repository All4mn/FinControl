import { useState, useEffect } from "react";
import axios from "axios";
import { validarCreateMoeda } from "./createMoedaSchema";

const API_BASE_URL = import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

export const useCreateMoeda = () => {
  // ── Criar
  const [formData, setFormData] = useState({ nome_moeda: "" });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // ── Listar
  const [moedas, setMoedas] = useState([]);
  const [carregandoLista, setCarregandoLista] = useState(false);
  const [erroLista, setErroLista] = useState("");

  // ── Editar inline
  const [editandoId, setEditandoId] = useState(null);
  const [editandoValor, setEditandoValor] = useState("");
  const [salvando, setSalvando] = useState(false);

  // ── Deletar
  const [deletandoId, setDeletandoId] = useState(null);

  useEffect(() => {
    buscarMoedas();
  }, []);

  const buscarMoedas = async () => {
    setCarregandoLista(true);
    setErroLista("");
    try {
      const { data } = await axios.get(`${API_BASE_URL}/moedas`, { withCredentials: true });
      setMoedas(data.dados || data);
    } catch (err) {
      console.error("Erro ao buscar moedas:", err);
      setErroLista("Não foi possível carregar as moedas.");
    } finally {
      setCarregandoLista(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErro("");
    setSucesso("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const errorMsg = validarCreateMoeda(formData);
    if (errorMsg) return setErro(errorMsg);

    setCarregando(true);
    try {
      const payload = { nome_moeda: formData.nome_moeda.trim() };
      const { data } = await axios.post(`${API_BASE_URL}/moedas`, payload, { withCredentials: true });

      setFormData({ nome_moeda: "" });
      setSucesso("Moeda criada com sucesso!");
      setMoedas((prev) => [...prev, data.dados || data]);
    } catch (err) {
      console.error("Erro ao criar moeda:", err);
      setErro(err.response?.data?.mensagem || "Erro ao criar moeda.");
    } finally {
      setCarregando(false);
    }
  };

  const iniciarEdicao = (moeda) => {
    setErroLista("");
    setEditandoId(moeda.id_moeda);
    setEditandoValor(moeda.nome_moeda);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditandoValor("");
  };

  const handleEditChange = (e) => {
    setEditandoValor(e.target.value);
  };

  const salvarEdicao = async (id) => {
    const errorMsg = validarCreateMoeda({ nome_moeda: editandoValor });
    if (errorMsg) return setErroLista(errorMsg);

    setSalvando(true);
    try {
      const payload = { nome_moeda: editandoValor.trim() };
      const { data } = await axios.put(`${API_BASE_URL}/moedas/${id}`, payload, { withCredentials: true });

      // ── CORREÇÃO AQUI: Usamos o operador spread (...m) para garantir que o id_moeda
      // antigo seja preservado na lista, mesmo se o back-end esquecer de devolvê-lo.
      setMoedas((prev) =>
        prev.map((m) =>
          m.id_moeda === id ? { ...m, ...(data.dados || data) } : m
        )
      );
      cancelarEdicao();
    } catch (err) {
      console.error("Erro ao atualizar moeda:", err);
      setErroLista(err.response?.data?.mensagem || "Erro ao atualizar moeda.");
    } finally {
      setSalvando(false);
    }
  };

  const deletarMoeda = async (id) => {
    setDeletandoId(id);
    setErroLista("");
    try {
      await axios.delete(`${API_BASE_URL}/moedas/${id}`, { withCredentials: true });
      setMoedas((prev) => prev.filter((m) => m.id_moeda !== id));
    } catch (err) {
      console.error("Erro ao deletar moeda:", err);
      setErroLista(err.response?.data?.mensagem || "Não foi possível excluir a moeda.");
    } finally {
      setDeletandoId(null);
    }
  };

  return {
      formData, carregando, erro, sucesso, handleChange, handleSubmit,
      moedas, carregandoLista, erroLista,
      editandoId, editandoValor, salvando, iniciarEdicao, cancelarEdicao, handleEditChange, salvarEdicao,
      deletandoId, deletarMoeda,
    };
  };