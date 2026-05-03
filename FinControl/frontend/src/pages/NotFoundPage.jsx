import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="page-center">
      <div className="card">
        <h2>Página não encontrada</h2>
        <p>Volte para a página inicial.</p>
        <Link className="button-secondary" to="/">Ir para Dashboard</Link>
      </div>
    </main>
  );
}
