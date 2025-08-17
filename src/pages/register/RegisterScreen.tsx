import React from 'react';
import { Link } from 'react-router-dom'; // Para criar um link para a tela de login
import logo from '../../assets/images/logo.png';
import RegisterForm from './RegisterForm';

const RegisterScreen: React.FC = () => {
  const slogan = "Cadastre-se e comece a organizar sua biblioteca.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="Logo Letrário" className="w-24 h-24 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Crie sua conta</h1>
        <p className="text-xl italic text-center">"{slogan}"</p>
      </div>

      <RegisterForm />

      <div className="mt-6 text-sm text-center">
        Já tem uma conta?{' '}
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
          Faça login
        </Link>
      </div>
    </div>
  );
};

export default RegisterScreen;