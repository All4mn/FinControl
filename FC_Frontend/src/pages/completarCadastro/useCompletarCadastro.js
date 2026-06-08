import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { validarCompletarCadastro, formatarTelefone } from "./CompletarCadastroSchema";

const API_BASE_URL = import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

export const useCompletarCadastro = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
  });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [idUsuario, setIdUsuario] = useState(null);

  useEffect(() => {
    const usuarioRota = location.state?.usuario;
    const usuarioSalvo = window.sessionStorage.getItem("completarCadastroUsuario");
    const usuario = usuarioRota || (usuarioSalvo ? JSON.parse(usuarioSalvo) : null);

    if (!usuario) {
      navigate("/login");
      return;
    }

    setIdUsuario(usuario.id_usuario);
    setFormData({
      nome: usuario.nome_usuario || "",
      email: usuario.email_usuario || "",
      telefone: usuario.telefone_usuario ? formatarTelefone(usuario.telefone_usuario) : "",
    });

    if (usuarioRota) {
      window.sessionStorage.setItem("completarCadastroUsuario", JSON.stringify(usuario));
    }
  }, [location.state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErro("");
  };

  const handleTelefoneChange = (e) => {
    const valorFormatado = formatarTelefone(e.target.value);
    setFormData((prev) => ({ ...prev, telefone: valorFormatado }));
    setErro("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validarCompletarCadastro(formData);
    if (validationError || !idUsuario) {
      if (validationError) setErro(validationError);
      return;
    }

    setCarregando(true);
    try {
      const dadosAtualizacao = {
        nome_usuario: formData.nome.trim(),
        email_usuario: formData.email.trim(),
        telefone_usuario: formData.telefone.replace(/\D/g, ""),
      };

      await axios.put(
        `${API_BASE_URL}/usuarios/${idUsuario}`,
        dadosAtualizacao,
        { withCredentials: true }
      );

      window.sessionStorage.removeItem("completarCadastroUsuario");
      navigate("/dashboard");
    } catch (err) {
      console.error("Erro ao completar cadastro:", err);
      setErro(err.response?.data?.mensagem || "Erro ao completar cadastro. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return {
    formData,
    erro,
    carregando,
    handleChange,
    handleTelefoneChange,
    handleSubmit,
  };
};
