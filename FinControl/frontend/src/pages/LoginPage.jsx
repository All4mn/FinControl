import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService.js';
import { saveSession } from '../services/auth.js';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro('');

    try {
      const resultado = await login({ email, senha });
      if (!resultado.sucesso) {
        setErro(resultado.mensagem || 'Falha ao entrar');
        return;
      }

      saveSession(resultado.token, resultado.usuario);
      onLogin(resultado.usuario);
      navigate('/');
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Falha ao entrar');
    }
  };

  return (
    <main className="page-center">
      <div className="card">
        <h2>Entrar</h2>
        <form onSubmit={handleSubmit} className="form-group">
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
            />
          </label>

          {erro && <p className="form-error">{erro}</p>}

          <button type="submit">Entrar</button>
        </form>

        <p className="text-sm">
          Não tem conta? <Link to="/registro">Cadastre-se</Link>
        </p>
      </div>
    </main>
  );
}
