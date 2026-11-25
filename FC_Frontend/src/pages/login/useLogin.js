import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { validarLogin } from "./LoginSchema";

const API_BASE_URL = import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

export const useLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErro("");
  };

  const toggleMostrarSenha = () => setMostrarSenha(!mostrarSenha);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validarLogin(formData);
    if (validationError) {
      setErro(validationError);
      return;
    }

    setCarregando(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/usuarios/login`,
        {
          email_usuario: formData.email,
          senha_usuario: formData.senha,
        },
        { withCredentials: true }
      );

      if (response.data?.sucesso) {
        navigate("/dashboard");
        return;
      }

      setErro(response.data?.mensagem || "Não foi possível entrar. Tente novamente.");
    } catch (err) {
      const mensagemBackend = err.response?.data?.mensagem || err.response?.data?.message;
      const mensagemPadrao =
        err.response?.status === 401
          ? "Email ou senha incorretos. Tente novamente."
          : err.response?.status >= 500
            ? "Servidor indisponível. Tente novamente em instantes."
            : "Não foi possível entrar. Tente novamente.";

      setErro(mensagemBackend || mensagemPadrao);
    } finally {
      setCarregando(false);
    }
  };

  const handleGoogleCredentialResponse = async (response) => {
    if (!response?.credential) {
      setErro("Não foi possível obter o token do Google.");
      return;
    }

    const idToken = response.credential;

    try {
      setErro("");
      const result = await axios.post(
        `${API_BASE_URL}/usuarios/login-google`,
        { idToken },
        { withCredentials: true }
      );

      if (result.data.sucesso) {
        const { dados: usuario, cadastroIncompleto } = result.data;

        if (cadastroIncompleto) {
          window.sessionStorage.setItem("completarCadastroUsuario", JSON.stringify(usuario));
          navigate("/completar-cadastro", { state: { usuario, fromGoogle: true } });
        } else {
          navigate("/dashboard");
        }
      } else {
        setErro(result.data.mensagem || "Erro no login com Google.");
      }
    } catch (err) {
      const mensagem =
        err.response?.data?.mensagem ||
        err.response?.data?.message ||
        "Erro ao fazer login com Google. Tente novamente.";

      setErro(mensagem);
    }
  };

  return {
    formData,
    mostrarSenha,
    carregando,
    erro,
    setErro,
    handleChange,
    handleSubmit,
    toggleMostrarSenha,
    handleGoogleCredentialResponse,
  };
};
