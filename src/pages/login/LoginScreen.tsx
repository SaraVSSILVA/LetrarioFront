import React from 'react';
import logo from   '../../assets/logo.png';
import LoginForm from './LoginForm';

const LoginScreen: React.FC = () => {
  const slogan = "Onde seus livros têm voz e sua estante ganha vida.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="Logo Letrário" className="w-24 h-24 mb-4" />
        <p className="text-xl italic text-center">"{slogan}"</p>
      </div>

      <LoginForm />

      <button className="mt-6 text-sm text-indigo-400 hover:text-indigo-300">
        Ainda não tem uma conta? Cadastre-se
      </button>
    </div>
  );
};

export default LoginScreen;