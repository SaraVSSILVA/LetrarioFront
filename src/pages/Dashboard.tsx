import { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

const Dashboard = () => {
  const [dark, setDark] = useState(false);
  const [stats, setStats] = useState({
    livros: 0,
    usuarios: 0,
    emprestimosAtivos: 0,
    emprestimosFinalizados: 0,
  });
  const [alerts, setAlerts] = useState<
    { livro: string; usuario: string; data: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError('');
        // Example API calls, replace with your endpoints
        const [livrosRes, usuariosRes, emprestimosRes, alertsRes] =
          await Promise.all([
            api.get('/livros/count'),
            api.get('/usuarios/count'),
            api.get('/emprestimos/stats'),
            api.get('/emprestimos/alerts'),
          ]);
        setStats({
          livros: livrosRes.data.count,
          usuarios: usuariosRes.data.count,
          emprestimosAtivos: emprestimosRes.data.ativos,
          emprestimosFinalizados: emprestimosRes.data.finalizados,
        });
        setAlerts(alertsRes.data);
      } catch {
        setError('Erro ao carregar estatísticas.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className={dark ? 'dark' : ''}>
      <DashboardLayout>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bem-vindo(a) 👋</h1>
            <p className="text-lg">Aqui está um resumo da sua biblioteca:</p>
          </div>
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600 dark:bg-yellow-400 dark:text-black transition"
            onClick={() => setDark((d) => !d)}
            aria-label="Alternar tema claro/escuro"
          >
            {dark ? '🌞 Tema Claro' : '🌙 Tema Escuro'}
          </button>
        </div>
        {loading && <p>Carregando...</p>}
        {error ? (
          <div className="text-red-500">
            {error}
            <br />
            <span className="text-gray-700">
              Verifique se há dados cadastrados ou se a API está disponível.
            </span>
          </div>
        ) : null}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h2 className="text-xl font-semibold">📚 Livros</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Total cadastrados: {stats.livros}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h2 className="text-xl font-semibold">👤 Usuários</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Total: {stats.usuarios}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h2 className="text-xl font-semibold">🔁 Empréstimos Ativos</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {stats.emprestimosAtivos}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h2 className="text-xl font-semibold">
              ✅ Empréstimos Finalizados
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {stats.emprestimosFinalizados}
            </p>
          </div>
        </div>
        {alerts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-2 text-red-700 dark:text-yellow-400">
              ⚠️ Devoluções próximas
            </h2>
            <ul className="list-disc ml-6">
              {alerts.map((a, i) => (
                <li key={i} className="text-red-600 dark:text-yellow-300">
                  Livro: <b>{a.livro}</b> | Usuário: <b>{a.usuario}</b> | Data:{' '}
                  <b>{a.data}</b>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DashboardLayout>
    </div>
  );
};

export default Dashboard;
