import { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

interface User {
  id: number;
  username: string;
  // Adicione outros campos conforme necessário
  email?: string;
  nome?: string;
}

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', nome: '' });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    nome: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/usuario/all');
        setUsers(response.data);
      } catch {
        setError('Erro ao carregar usuários.');
      } finally {
        setLoading(false);
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={() => {
            // Simulação: pega o primeiro usuário como logado
            const user = users[0];
            if (user) {
              setProfileForm({
                username: user.username,
                email: user.email || '',
                nome: user.nome || '',
              });
              setShowProfileModal(true);
            }
          }}
        >
          Editar perfil
        </button>;
      }
    };
    fetchUsers();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Usuários</h1>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Buscar usuário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded w-64"
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              setShowModal(true);
              setEditId(null);
              setForm({ username: '', email: '', nome: '' });
            }}
          >
            Adicionar usuário
          </button>
        </div>
      </div>
      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {successMsg && <p className="text-green-600">{successMsg}</p>}
      <div className="grid grid-cols-3 gap-6 mt-8">
        {users
          .filter((u) =>
            u.username.toLowerCase().includes(search.toLowerCase()),
          )
          .map((user) => (
            <div
              key={user.id}
              className="bg-white p-6 rounded shadow flex flex-col items-center"
            >
              <h2 className="text-xl font-semibold text-center">
                {user.username}
              </h2>
              {user.nome ? <p className="text-gray-700">{user.nome}</p> : null}
              {user.email ? (
                <p className="text-gray-500">{user.email}</p>
              ) : null}
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                  onClick={() => {
                    setForm({
                      username: user.username,
                      email: user.email || '',
                      nome: user.nome || '',
                    });
                    setEditId(user.id);
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
                        'Tem certeza que deseja remover este usuário?',
                      )
                    ) {
                      await api.delete(`/usuario/${user.id}`);
                      setUsers(users.filter((u) => u.id !== user.id));
                    }
                  }}
                >
                  Remover email: form.email, nome: form.nome,
                </button>
              </div>
            </div>
          ))}
      </div>
      email: form.email, nome: form.nome,
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
              {editId ? 'Editar Usuário' : 'Cadastrar Usuário'}
            </h2>
            {formError && <p className="text-red-500 mb-2">{formError}</p>}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setFormError('');
                setFormLoading(true);
                try {
                  if (editId) {
                    await api.put('/usuario/update', {
                      id: editId,
                      username: form.username,
                      email: form.email,
                      nome: form.nome,
                    });
                  } else {
                    await api.post('/usuario/register', {
                      username: form.username,
                      password: '123456',
                      email: form.email,
                      nome: form.nome,
                    });
                  }
                  setShowModal(false);
                  setForm({ username: '', email: '', nome: '' });
                  setEditId(null);
                  setSuccessMsg(
                    editId
                      ? 'Usuário editado com sucesso!'
                      : 'Usuário cadastrado com sucesso!',
                  );
                  setTimeout(() => setSuccessMsg(''), 2000);
                  // Atualiza lista
                  const response = await api.get('/usuario/all');
                  setUsers(response.data);
                } catch {
                  setFormError(
                    editId
                      ? 'Erro ao editar usuário.'
                      : 'Erro ao cadastrar usuário.',
                  );
                } finally {
                  setFormLoading(false);
                }
              }}
            >
              <input
                type="text"
                placeholder="Nome de usuário"
                value={form.username}
                onChange={(e) =>
                  setForm((f) => ({ ...f, username: e.target.value }))
                }
                className="w-full p-2 mb-4 border rounded"
                required
                disabled={formLoading}
              />
              <input
                type="text"
                placeholder="Nome completo"
                value={form.nome}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nome: e.target.value }))
                }
                className="w-full p-2 mb-4 border rounded"
                disabled={formLoading}
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full p-2 mb-6 border rounded"
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
      {/* Modal de edição de perfil */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowProfileModal(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>
            {profileError && (
              <p className="text-red-500 mb-2">{profileError}</p>
            )}
            {profileSuccess && (
              <p className="text-green-600 mb-2">{profileSuccess}</p>
            )}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setProfileError('');
                setProfileLoading(true);
                try {
                  // Simulação: pega o primeiro usuário como logado
                  const user = users[0];
                  if (user) {
                    await api.put('/usuario/update', {
                      id: user.id,
                      username: profileForm.username,
                      email: profileForm.email,
                      nome: profileForm.nome,
                    });
                    setProfileSuccess('Perfil atualizado com sucesso!');
                    setTimeout(() => setProfileSuccess(''), 2000);
                    setShowProfileModal(false);
                    // Atualiza lista
                    const response = await api.get('/usuario/all');
                    setUsers(response.data);
                  }
                } catch {
                  setProfileError('Erro ao atualizar perfil.');
                } finally {
                  setProfileLoading(false);
                }
              }}
            >
              <input
                type="text"
                placeholder="Nome de usuário"
                value={profileForm.username}
                onChange={(e) =>
                  setProfileForm((f) => ({ ...f, username: e.target.value }))
                }
                className="w-full p-2 mb-4 border rounded"
                required
                disabled={profileLoading}
              />
              <input
                type="text"
                placeholder="Nome completo"
                value={profileForm.nome}
                onChange={(e) =>
                  setProfileForm((f) => ({ ...f, nome: e.target.value }))
                }
                className="w-full p-2 mb-4 border rounded"
                disabled={profileLoading}
              />
              <input
                type="email"
                placeholder="Email"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full p-2 mb-6 border rounded"
                disabled={profileLoading}
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                disabled={profileLoading}
              >
                {profileLoading ? 'Salvando...' : 'Salvar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UserPage;
