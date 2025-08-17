import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const response = await axios.post('https://api.letrario.app/api/usuario/register', {
        username,
        password,
      });

      if (response.status === 201) {
        setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Redireciona após 2 segundos
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 409) {
          setError('Nome de usuário já está em uso.');
        } else {
          setError('Erro ao se cadastrar. Tente novamente mais tarde.');
        }
      } else {
        setError('Não foi possível conectar. Verifique sua conexão.');
      }
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col p-8 bg-gray-800 rounded-lg shadow-2xl w-80">
      {success && <p className="text-green-400 mb-4 text-center">{success}</p>}
      {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

      <label htmlFor="username" className="mb-2 text-sm font-semibold text-gray-400">
        E-mail
      </label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="p-2 mb-4 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <label htmlFor="password" className="mb-2 text-sm font-semibold text-gray-400">
        Senha
      </label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 mb-4 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <label htmlFor="confirmPassword" className="mb-2 text-sm font-semibold text-gray-400">
        Confirme a Senha
      </label>
      <input
        type="password"
        id="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="p-2 mb-6 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        type="submit"
        className="p-2 font-bold text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Cadastrar
      </button>
    </form>
  );
};

export default RegisterForm;