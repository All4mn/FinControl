import { Link } from 'react-router-dom';

export default function Header({ user, onLogout }) {
  return (
    <header className="app-header">
      <div className="brand">
        <h1>FinControl</h1>
        <span>Olá, {user?.nome || 'usuário'}</span>
      </div>
      <nav className="menu">
        <Link to="/">Dashboard</Link>
        <Link to="/transacoes">Transações</Link>
        <Link to="/contas">Contas</Link>
        <Link to="/categorias">Categorias</Link>
      </nav>
      <button className="button-secondary" type="button" onClick={onLogout}>
        Sair
      </button>
    </header>
  );
}
