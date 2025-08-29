import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onFlip: () => void;
  customStyle?: any;
}

const LoginForm: React.FC<LoginFormProps> = ({ onFlip, customStyle = {} }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { username, password },
      );
      const { access_token } = response.data;
      localStorage.setItem('authToken', access_token);
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response)
        setError('Usuário ou senha inválidos.');
      else setError('Erro ao tentar fazer login. Tente novamente mais tarde.');
    }
  };

  return (
    <form onSubmit={handleLogin} className={customStyle.loginForm || ''}>
      {error && <p style={{ color: 'red', marginBottom: 10 }}>{error}</p>}
      <h2 className={customStyle.loginFormTitulo || ''}>Login</h2>
      <div className={customStyle.formGroup || ''}>
        <label htmlFor="username" className={customStyle.formGroupLabel || ''}>
          Usuário:
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={customStyle.formGroupInput || ''}
        />
      </div>
      <div className={customStyle.formGroup || ''}>
        <label htmlFor="password" className={customStyle.formGroupLabel || ''}>
          Senha:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={customStyle.formGroupInput || ''}
        />
      </div>
      <button type="submit" className={customStyle.formBtn || ''}>
        Entrar
      </button>
    </form>
  );
};

export default LoginForm;
