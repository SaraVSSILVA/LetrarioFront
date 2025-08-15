import { useNavigate } from 'react-router-dom'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Letrário 📚</h2>
        <nav className="flex flex-col gap-4">
          <a href="/dashboard" className="hover:underline">Início</a>
          <a href="/livros" className="hover:underline">Livros</a>
          <a href="/emprestimos" className="hover:underline">Empréstimos</a>
          <a href="/desejos" className="hover:underline">Lista de Desejos</a>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-10 bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Sair
        </button>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-10 bg-gray-100 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout