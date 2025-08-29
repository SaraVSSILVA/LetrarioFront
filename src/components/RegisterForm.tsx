import React, { useState } from 'react';
import axios from 'axios';

interface RegisterFormProps {
  onFlip: () => void;
  customStyle?: any;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onFlip,
  customStyle = {},
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        { username, password },
      );
      if (response.status === 201) {
        setSuccess('Cadastro realizado! Voltando ao login...');
        setTimeout(() => onFlip(), 2000);
      }
    } catch (err: any) {
      if (err.response?.status === 409) setError('Usuário já existe.');
      else setError('Erro ao cadastrar. Tente novamente mais tarde.');
    }
  };

  return (
    <form onSubmit={handleRegister} className={customStyle.cadastroForm || ''}>
      {success && <p style={{ color: 'green', marginBottom: 10 }}>{success}</p>}
      {error && <p style={{ color: 'red', marginBottom: 10 }}>{error}</p>}
      <h2 className={customStyle.cadastroFormTitulo || ''}>Cadastro</h2>
      <div className={customStyle.formGroup || ''}>
        <label className={customStyle.formGroupLabel || ''}>Nome:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={customStyle.formGroupInput || ''}
        />
      </div>
      <div className={customStyle.formGroup || ''}>
        <label className={customStyle.formGroupLabel || ''}>E-mail:</label>
        <input
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={customStyle.formGroupInput || ''}
        />
      </div>
      <div className={customStyle.formGroup || ''}>
        <label className={customStyle.formGroupLabel || ''}>Senha:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={customStyle.formGroupInput || ''}
        />
      </div>
      <button type="submit" className={customStyle.formBtn || ''}>
        Cadastrar
      </button>
    </form>
  );
};

export default RegisterForm;
