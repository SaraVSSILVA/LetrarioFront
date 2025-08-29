import { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
// Supondo que o ID do usuário logado está no localStorage
const usuarioId = Number(localStorage.getItem('usuarioId'));

interface Loan {
  id: number;
  livro: { id: number; titulo: string };
  usuarioQueEmpresta: { id: number; username: string };
  usuarioQueRecebe: { id: number; username: string };
  dataPrevistaDevolucao: string;
  status?: string;
}

const LoanPage = () => {
  const [editId, setEditId] = useState<number | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    livroId: '',
    usuarioQueEmprestaId: '',
    usuarioQueRecebeId: '',
    dataPrevistaDevolucao: '',
  });
  const [books, setBooks] = useState<{ id: number; titulo: string }[]>([]);
  const [users, setUsers] = useState<{ id: number; username: string }[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [filter, setFilter] = useState({
    livroId: '',
    usuarioId: '',
    status: '',
    tipo: '', // "tomados", "concedidos", ou vazio
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        let loanRes;
        if (filter.status) {
          loanRes = await api.get(
            `/emprestimo/usuario/${usuarioId}/historico?status=${filter.status}`,
          );
        } else if (filter.tipo === 'tomados') {
          loanRes = await api.get(`/emprestimo/tomados-por/${usuarioId}`);
        } else if (filter.tipo === 'concedidos') {
          loanRes = await api.get(`/emprestimo/concedidos-por/${usuarioId}`);
        } else {
          loanRes = await api.get('/emprestimo');
        }
        const [bookRes, userRes] = await Promise.all([
          api.get('/livro'),
          api.get('/usuario/all'),
        ]);
        setLoans(loanRes.data);
        setBooks(bookRes.data);
        setUsers(userRes.data);
      } catch (err: any) {
        setError('Erro ao carregar dados.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold">Empréstimos</h1>
          <div className="flex gap-2 items-center">
            <select
              value={filter.tipo}
              onChange={(e) =>
                setFilter((f) => ({ ...f, tipo: e.target.value }))
              }
              className="p-2 border rounded"
            >
              <option value="">Todos</option>
              <option value="tomados">Tomados</option>
              <option value="concedidos">Concedidos</option>
            </select>
            <select
              value={filter.livroId}
              onChange={(e) =>
                setFilter((f) => ({ ...f, livroId: e.target.value }))
              }
              className="p-2 border rounded"
            >
              <option value="">Filtrar por livro</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.titulo}
                </option>
              ))}
            </select>
            <select
              value={filter.status}
              onChange={(e) =>
                setFilter((f) => ({ ...f, status: e.target.value }))
              }
              className="p-2 border rounded"
            >
              <option value="">Status</option>
              <option value="ativo">Ativo</option>
              <option value="concluido">Concluído</option>
            </select>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => {
                setShowModal(true);
                setEditId(null);
                setForm({
                  livroId: '',
                  usuarioQueEmprestaId: '',
                  usuarioQueRecebeId: '',
                  dataPrevistaDevolucao: '',
                });
              }}
            >
              Novo empréstimo
            </button>
          </div>
        </div>
        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {successMsg && <p className="text-green-600">{successMsg}</p>}
        <div className="grid grid-cols-2 gap-6 mt-8">
          {loans.length === 0 ? (
            <p className="col-span-2 text-center text-gray-500">
              Nenhum empréstimo registrado.
            </p>
          ) : (
            loans
              .filter(
                (loan) =>
                  (!filter.livroId ||
                    loan.livro.id === Number(filter.livroId)) &&
                  (!filter.usuarioId ||
                    loan.usuarioQueEmpresta.id === Number(filter.usuarioId) ||
                    loan.usuarioQueRecebe.id === Number(filter.usuarioId)) &&
                  (!filter.status ||
                    (loan.status &&
                      loan.status.toLowerCase() === filter.status)),
              )
              .map((loan) => (
                <div
                  key={loan.id}
                  className="bg-white p-6 rounded shadow flex flex-col"
                >
                  <span className="font-bold mb-2">
                    Livro: {loan.livro.titulo}
                  </span>
                  <span>
                    Emprestado por: {loan.usuarioQueEmpresta.username}
                  </span>
                  <span>Recebido por: {loan.usuarioQueRecebe.username}</span>
                  <span>
                    Devolução prevista:{' '}
                    {new Date(loan.dataPrevistaDevolucao).toLocaleDateString()}
                  </span>
                  {loan.status && <span>Status: {loan.status}</span>}
                  <div className="flex gap-2 mt-4">
                    <button
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                      onClick={() => {
                        setForm({
                          livroId: String(loan.livro.id),
                          usuarioQueEmprestaId: String(
                            loan.usuarioQueEmpresta.id,
                          ),
                          usuarioQueRecebeId: String(loan.usuarioQueRecebe.id),
                          dataPrevistaDevolucao: loan.dataPrevistaDevolucao,
                        });
                        setEditId(loan.id);
                        setShowModal(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      onClick={async () => {
                        if (
                          window.confirm('Marcar empréstimo como devolvido?')
                        ) {
                          try {
                            await api.put(`/emprestimo/${loan.id}/devolver`);
                            setSuccessMsg('Empréstimo devolvido com sucesso!');
                            setLoans(
                              loans.map((l) =>
                                l.id === loan.id
                                  ? { ...l, status: 'concluido' }
                                  : l,
                              ),
                            );
                          } catch {
                            setError('Erro ao devolver empréstimo.');
                          }
                        }
                      }}
                    >
                      Devolver
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={async () => {
                        if (
                          window.confirm(
                            'Tem certeza que deseja remover este empréstimo?',
                          )
                        ) {
                          await api.delete(`/emprestimo/${loan.id}`);
                          setLoans(loans.filter((l) => l.id !== loan.id));
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
        {/* ...outros componentes, modais, etc... */}
      </div>
    </DashboardLayout>
  );
};

export default LoanPage;
