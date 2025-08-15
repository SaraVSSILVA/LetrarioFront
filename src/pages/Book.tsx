import { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

interface Book {
  id: number;
  titulo: string;
  autor: string;
  capaUrl?: string;
  generoId?: number;
  genero?: { id: number; nome: string };
}

const BookPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titulo: '', autor: '', generoId: '' });
  const [genres, setGenres] = useState<{ id: number; nome: string }[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/livro');
        setBooks(response.data);
      } catch {
        setError('Erro ao carregar livros.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
    // Busca gêneros
    api
      .get('/genero')
      .then((res) => setGenres(res.data))
      .catch(() => setGenres([]));
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Catálogo de Livros</h1>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Buscar por título ou autor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded w-64"
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowModal(true)}
          >
            Adicionar livro
          </button>
        </div>
      </div>
      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {successMsg && <p className="text-green-600">{successMsg}</p>}
      <div className="grid grid-cols-4 gap-6 mt-8">
        {books.length === 0 ? (
          <p className="col-span-4 text-center text-gray-500">
            Nenhum livro cadastrado.
          </p>
        ) : (
          books
            .filter(
              (book) =>
                book.titulo.toLowerCase().includes(search.toLowerCase()) ||
                book.autor.toLowerCase().includes(search.toLowerCase()),
            )
            .map((book) => (
              <div
                key={book.id}
                className="bg-white p-6 rounded shadow flex flex-col items-center"
              >
                {book.capaUrl ? (
                  <img
                    src={book.capaUrl}
                    alt={book.titulo}
                    className="w-32 h-48 object-cover mb-4 rounded"
                  />
                ) : (
                  <div className="w-32 h-48 bg-gray-200 flex items-center justify-center mb-4 rounded">
                    Sem capa
                  </div>
                )}
                <h2 className="text-xl font-semibold text-center">
                  {book.titulo}
                </h2>
                <p className="text-gray-600 text-center">{book.autor}</p>
                {book.genero && (
                  <span className="text-sm text-blue-700 mb-2">
                    Gênero: {book.genero.nome}
                  </span>
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                    onClick={() => {
                      setForm({
                        titulo: book.titulo,
                        autor: book.autor,
                        generoId: book.generoId?.toString() || '',
                      });
                      setEditId(book.id);
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
                          'Tem certeza que deseja remover este livro?',
                        )
                      ) {
                        await api.delete(`/livro/${book.id}`);
                        setBooks(books.filter((b) => b.id !== book.id));
                      }
                    }}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Modal de cadastro */}
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
              {editId ? 'Editar Livro' : 'Cadastrar Livro'}
            </h2>
            {formError && <p className="text-red-500 mb-2">{formError}</p>}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setFormError('');
                setFormLoading(true);
                try {
                  // Busca capa via Google Books API
                  let capaUrl = '';
                  try {
                    const googleRes = await fetch(
                      `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(form.titulo)}+inauthor:${encodeURIComponent(form.autor)}`,
                    );
                    const googleData = await googleRes.json();
                    capaUrl =
                      googleData.items?.[0]?.volumeInfo?.imageLinks
                        ?.thumbnail || '';
                  } catch {
                    setError('Erro ao buscar capa do livro.');
                  }
                  if (editId) {
                    // Editar livro
                    await api.put(`/livro/${editId}`, {
                      titulo: form.titulo,
                      autor: form.autor,
                      capaUrl,
                      generoId: form.generoId
                        ? Number(form.generoId)
                        : undefined,
                    });
                  } else {
                    // Cadastrar livro
                    await api.post('/livro', {
                      titulo: form.titulo,
                      autor: form.autor,
                      capaUrl,
                      generoId: form.generoId
                        ? Number(form.generoId)
                        : undefined,
                    });
                  }
                  setShowModal(false);
                  setForm({ titulo: '', autor: '', generoId: '' });
                  setEditId(null);
                  setSuccessMsg(
                    editId
                      ? 'Livro editado com sucesso!'
                      : 'Livro cadastrado com sucesso!',
                  );
                  setTimeout(() => setSuccessMsg(''), 2000);
                  // Atualiza lista
                  const response = await api.get('/livro');
                  setBooks(response.data);
                } catch {
                  setFormError(
                    editId
                      ? 'Erro ao editar livro.'
                      : 'Erro ao cadastrar livro.',
                  );
                } finally {
                  setFormLoading(false);
                }
              }}
            >
              <input
                type="text"
                placeholder="Título"
                value={form.titulo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, titulo: e.target.value }))
                }
                className="w-full p-2 mb-4 border rounded"
                required
                disabled={formLoading}
              />
              <input
                type="text"
                placeholder="Autor"
                value={form.autor}
                onChange={(e) =>
                  setForm((f) => ({ ...f, autor: e.target.value }))
                }
                className="w-full p-2 mb-4 border rounded"
                required
                disabled={formLoading}
              />
              <select
                value={form.generoId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, generoId: e.target.value }))
                }
                className="w-full p-2 mb-6 border rounded"
                required
                disabled={formLoading}
              >
                <option value="">Selecione o gênero</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nome}
                  </option>
                ))}
              </select>
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

export default BookPage;
