import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, login } from '../services/authService.js';
import { saveSession } from '../services/auth.js';

export default function RegisterPage({ onRegister }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro('');

    try {
      const resultado = await register({ nome, email, senha });
      if (!resultado.sucesso) {
        setErro(resultado.mensagem || 'Falha ao cadastrar');
        return;
      }

      const loginResult = await login({ email, senha });
      saveSession(loginResult.token, loginResult.usuario);
      onRegister(loginResult.usuario);
      navigate('/');
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Falha ao cadastrar');
    }
  };

  return (
    <main className="page-center">
      <div className="card">
        <h2>Cadastro</h2>
        <form onSubmit={handleSubmit} className="form-group">
          <label>
            Nome
            <input value={nome} onChange={(event) => setNome(event.target.value)} required />
          </label>

          <label>
            E-mail
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>

          <label>
            Senha
            <input type="password" value={senha} onChange={(event) => setSenha(event.target.value)} required />
          </label>

          {erro && <p className="form-error">{erro}</p>}

          <button type="submit">Cadastrar</button>
        </form>

        <p className="text-sm">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </main>
  );
}
