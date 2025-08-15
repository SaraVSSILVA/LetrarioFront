import { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

interface Genre {
  id: number;
  nome: string;
}

const GenrePage = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nome: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/genero');
        setGenres(response.data);
      } catch {
        setError('Erro ao carregar gêneros.');
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Gêneros</h1>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Buscar gênero..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded w-64"
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              setShowModal(true);
              setEditId(null);
              setForm({ nome: '' });
            }}
          >
            Adicionar gênero
          </button>
        </div>
      </div>
      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-3 gap-6 mt-8">
        {genres
          .filter((g) => g.nome.toLowerCase().includes(search.toLowerCase()))
          .map((genre) => (
            <div
              key={genre.id}
              className="bg-white p-6 rounded shadow flex flex-col items-center"
            >
              <h2 className="text-xl font-semibold text-center">
                {genre.nome}
              </h2>
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                  onClick={() => {
                    setForm({ nome: genre.nome });
                    setEditId(genre.id);
                    setShowModal(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={async () => {
                    if (
                      window.confirm(
                        'Tem certeza que deseja remover este gênero?',
                      )
                    ) {
                      await api.delete(`/genero/${genre.id}`);
                      setGenres(genres.filter((g) => g.id !== genre.id));
                    }
                  }}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
      </div>
      {/* Modal de cadastro/edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {editId ? 'Editar Gênero' : 'Cadastrar Gênero'}
            </h2>
            {formError && <p className="text-red-500 mb-2">{formError}</p>}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setFormError('');
                setFormLoading(true);
                try {
                  if (editId) {
                    await api.put(`/genero/${editId}`, { nome: form.nome });
                  } else {
                    await api.post('/genero', { nome: form.nome });
                  }
                  setShowModal(false);
                  setForm({ nome: '' });
                  setEditId(null);
                  // Atualiza lista
                  const response = await api.get('/genero');
                  setGenres(response.data);
                } catch {
                  setFormError(
                    editId
                      ? 'Erro ao editar gênero.'
                      : 'Erro ao cadastrar gênero.',
                  );
                } finally {
                  setFormLoading(false);
                }
              }}
            >
              <input
                type="text"
                placeholder="Nome do gênero"
                value={form.nome}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nome: e.target.value }))
                }
                className="w-full p-2 mb-6 border rounded"
                required
                disabled={formLoading}
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                disabled={formLoading}
              >
                {formLoading
                  ? editId
                    ? 'Salvando...'
                    : 'Cadastrando...'
                  : editId
                    ? 'Salvar'
                    : 'Cadastrar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default GenrePage;
