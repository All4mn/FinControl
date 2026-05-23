import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './PerfilModal.module.css';

const API_BASE_URL = import.meta.env.VITE_BACKEND_RENDER_URL || 'http://localhost:3000';

export default function PerfilModal({ usuario, isOpen, onClose }) {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [emailExistente, setEmailExistente] = useState(false);
  const [verificandoEmail, setVerificandoEmail] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Inicializar valores quando o modal abre
  useEffect(() => {
    if (isOpen && usuario) {
      setNome(usuario?.nome_usuario || usuario?.nome || '');
      setEmail(usuario?.email_usuario || usuario?.email || '');
      setSenha('');
      setModoEdicao(false);
      setEmailExistente(false);
    }
  }, [isOpen, usuario]);

  // Verificar se o email já existe
  const verificarEmail = async (novoEmail) => {
    if (!novoEmail || novoEmail === (usuario?.email_usuario || usuario?.email)) {
      setEmailExistente(false);
      return;
    }

    setVerificandoEmail(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/usuarios/verificar-email`,
        {
          params: { email: novoEmail },
          withCredentials: true,
        }
      );

      setEmailExistente(response.data.existe);
    } catch (err) {
      console.error('Erro ao verificar email:', err);
      setEmailExistente(false);
    } finally {
      setVerificandoEmail(false);
    }
  };

  // Debounce para verificar email
  useEffect(() => {
    const timer = setTimeout(() => {
      verificarEmail(email);
    }, 500);

    return () => clearTimeout(timer);
  }, [email]);

  const handleSalvar = async () => {
    if (emailExistente) {
      alert('Este email já está em uso!');
      return;
    }

    setCarregando(true);
    try {
      const dados = {
        nome_usuario: nome,
        email_usuario: email,
      };

      if (senha) {
        dados.senha = senha;
      }

      const response = await axios.put(
        `${API_BASE_URL}/usuarios/atualizar`,
        dados,
        { withCredentials: true }
      );

      if (response.data.sucesso) {
        alert('Perfil atualizado com sucesso!');
        setModoEdicao(false);
        onClose();
        window.location.reload();
      }
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      alert('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleDeletarConta = async () => {
    const confirmacao = window.confirm(
      'Tem certeza que deseja deletar sua conta? Esta ação é irreversível e todos os seus dados serão perdidos.'
    );

    if (!confirmacao) return;

    setCarregando(true);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/usuarios/deletar-conta`,
        { withCredentials: true }
      );

      if (response.data.sucesso) {
        alert('Conta deletada com sucesso!');
        onClose();
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Erro ao deletar conta:', err);
      alert('Erro ao deletar conta. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Meu Perfil</h2>
          <button
            className={styles.btnFechar}
            onClick={onClose}
            title="Fechar modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6l-12 12" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>
              {nome.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.label}>Nome</label>
            <input
              type="text"
              className={styles.input}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              readOnly={!modoEdicao}
            />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.label}>Email</label>
            <div className={styles.emailContainer}>
              <input
                type="email"
                className={`${styles.input} ${emailExistente ? styles.inputErro : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={!modoEdicao}
              />
              {modoEdicao && verificandoEmail && (
                <span className={styles.verificando}>Verificando...</span>
              )}
              {modoEdicao && emailExistente && !verificandoEmail && (
                <span className={styles.erroEmail}>Email já utilizado</span>
              )}
            </div>
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.label}>Senha</label>
            <div className={styles.senhaContainer}>
              <input
                type={mostrarSenha ? 'text' : 'password'}
                className={styles.input}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                readOnly={!modoEdicao}
                placeholder={!modoEdicao ? '••••••••' : 'Digite uma nova senha (opcional)'}
              />
              {modoEdicao && (
                <button
                  className={styles.btnMostrarSenha}
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  title={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {mostrarSenha ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          {!modoEdicao ? (
            <>
              <button className={styles.btnCancelar} onClick={onClose}>
                Fechar
              </button>
              <button className={styles.btnEditar} onClick={() => setModoEdicao(true)}>
                Editar Perfil
              </button>
            </>
          ) : (
            <>
              <button
                className={styles.btnCancelar}
                onClick={() => setModoEdicao(false)}
              >
                Cancelar
              </button>
              <button
                className={styles.btnEditar}
                onClick={handleSalvar}
                disabled={emailExistente || carregando}
              >
                {carregando ? 'Salvando...' : 'Salvar'}
              </button>
            </>
          )}
        </div>

        <div className={styles.modalDivisor} />

        <div className={styles.modalFooterDeletar}>
          <button
            className={styles.btnDeletar}
            onClick={handleDeletarConta}
            disabled={carregando}
          >
            {carregando ? 'Deletando...' : 'Deletar Conta'}
          </button>
        </div>
      </div>
    </div>
  );
}
