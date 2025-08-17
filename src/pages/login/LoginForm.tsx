import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importação corrigida

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
                username,
                password
            });
            
            const { access_token } = response.data;
            console.log('Login bem-sucedido! Token:', access_token);

            localStorage.setItem('authToken', access_token);

            navigate('/dashboard');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError('Usuário ou senha inválidos.');
            } else {
                setError('Erro ao tentar fazer login. Tente novamente mais tarde.');
            } 
        }
    };

    return (
        <form onSubmit={handleLogin} className="flex flex-col p-8 bg-gray-800 rounded-lg shadow-2xl w-80">
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
                className="p-2 mb-6 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
                type="submit"
                className="p-2 font-bold text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                Entrar
            </button>
        </form>
    );
};

export default LoginForm;