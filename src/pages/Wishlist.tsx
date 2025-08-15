/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardLayout from '../components/DashboardLayout';
import { useEffect, useState } from 'react';
import api from '../services/api';

interface WishlistItem {
  id: number;
  book: {
    id: number;
    titulo: string;
    autor: string;
    capaUrl?: string;
  };
}

const usuarioIdRaw = localStorage.getItem('usuarioId');
const usuarioId = usuarioIdRaw ? Number(usuarioIdRaw) : null;
const token = localStorage.getItem('token');
const usuarioValido = !!usuarioId && usuarioId > 0;

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    if (usuarioValido && token) {
      fetchWishlist();
    }
  }, []);

  async function fetchWishlist() {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/wishlist/${usuarioId}`);
      setWishlist(response.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Não autorizado. Faça login novamente.');
      } else {
        setError('Erro ao carregar lista de desejos.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(livroId: number) {
    if (window.confirm('Remover este desejo?')) {
      await api.delete(`/wishlist/${usuarioId}/${livroId}`);
      fetchWishlist();
    }
  }

  async function handleSearch() {
    setSearchLoading(true);
    setSearchError('');
    let res;
    try {
      res = await api.get(`/livro?search=${encodeURIComponent(search)}`);
      setSearchResults(res.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        try {
          res = await api.get(`/livros?search=${encodeURIComponent(search)}`);
          setSearchResults(res.data);
        } catch {
          setSearchError('Erro ao buscar livros.');
        }
      } else if (err.response?.status === 401) {
        setSearchError('Não autorizado. Faça login novamente.');
      } else {
        setSearchError('Erro ao buscar livros.');
      }
    }
    setSearchLoading(false);
  }

  async function handleAdd(livroId: number) {
    try {
      await api.post('/wishlist', { usuarioId, livroId });
      fetchWishlist();
      setShowAddModal(false);
      setSearchResults([]);
      setSearch('');
    } catch (err: any) {
      if (err.response?.status === 401) {
        alert('Não autorizado. Faça login novamente.');
      } else {
        alert('Erro ao adicionar desejo.');
      }
    }
  }

  // Verificação de autenticação e usuário
  if (!token || !usuarioValido) {
    return (
      <DashboardLayout>
        <h1 className="text-3xl font-bold mb-6">Lista de Desejos</h1>
        <p className="text-red-500">
          Usuário não autenticado ou inválido. Faça login novamente.
        </p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Lista de Desejos</h1>
      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {wishlist.length === 0 && !loading ? (
        <p className="text-gray-500">Nenhum desejo cadastrado ainda.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 mt-8">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded shadow flex flex-col items-center"
            >
              {item.book.capaUrl ? (
                <img
                  src={item.book.capaUrl}
                  alt={item.book.titulo}
                  className="w-32 h-48 object-cover mb-4 rounded"
                />
              ) : (
                <div className="w-32 h-48 bg-gray-200 flex items-center justify-center mb-4 rounded">
                  Sem capa
                </div>
              )}
              <h2 className="text-xl font-semibold text-center">
                {item.book.titulo}
              </h2>
              <p className="text-gray-600 text-center">{item.book.autor}</p>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mt-4"
                onClick={() => handleRemove(item.book.id)}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowAddModal(true)}
        >
          Adicionar desejo
        </button>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Buscar livro</h2>
            <input
              type="text"
              className="border p-2 w-full mb-4"
              placeholder="Digite nome ou autor do livro"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
              onClick={handleSearch}
            >
              Buscar
            </button>
            {searchLoading && <p>Buscando...</p>}
            {searchError && <p className="text-red-500">{searchError}</p>}
            <div className="max-h-64 overflow-y-auto mt-4">
              {searchResults.map((livro) => (
                <div
                  key={livro.id}
                  className="flex items-center gap-4 border-b py-2"
                >
                  {livro.capaUrl ? (
                    <img
                      src={livro.capaUrl}
                      alt={livro.titulo}
                      className="w-16 h-24 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-24 bg-gray-200 flex items-center justify-center rounded">
                      Sem capa
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-semibold">{livro.titulo}</div>
                    <div className="text-gray-600">{livro.autor}</div>
                  </div>
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => handleAdd(livro.id)}
                  >
                    Adicionar
                  </button>
                </div>
              ))}
            </div>
            <button
              className="mt-6 text-gray-600 hover:underline"
              onClick={() => {
                setShowAddModal(false);
                setSearchResults([]);
                setSearch('');
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default WishlistPage;
