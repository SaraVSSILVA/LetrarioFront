import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/usuario/register', {
        username,
        password,
      });
      setSuccess('Cadastro realizado com sucesso!');
      // Redireciona imediatamente e passa mensagem via state
      navigate('/login', {
        state: { toast: 'Cadastro realizado com sucesso!' },
      });
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError('Erro ao registrar: ' + err.response.data.message);
      } else {
        setError('Erro ao registrar.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Criar Conta</h2>

        {error && (
          <div className="mb-4">
            <p className="text-red-500 mb-2">{error}</p>
          </div>
        )}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-6 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-secondary text-white py-2 rounded hover:bg-yellow-600 transition mb-2"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        <button
          type="button"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          onClick={() => navigate('/login')}
        >
          Voltar para login
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
