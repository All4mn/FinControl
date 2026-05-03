import { useEffect, useState } from 'react';
import { getCategorias } from '../services/categoriaService.js';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const response = await getCategorias();
        setCategorias(response.dados);
      } catch (err) {
        setErro(err.response?.data?.mensagem || 'Falha ao carregar categorias');
      }
    };

    loadCategorias();
  }, []);

  return (
    <main className="page-content">
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Categorias</h2>
        </div>

        {erro && <p className="form-error">{erro}</p>}

        {categorias.length === 0 ? (
          <p>Nenhuma categoria encontrada.</p>
        ) : (
          <table className="table-list">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Cor</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td>{categoria.nome}</td>
                  <td>{categoria.tipo}</td>
                  <td>
                    <span className="category-chip" style={{ backgroundColor: categoria.cor }}>
                      {categoria.cor}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
