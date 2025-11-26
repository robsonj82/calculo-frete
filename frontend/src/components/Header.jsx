import { useNavigate } from 'react-router-dom'

export default function Header() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-primary-600">FreteMaster</h1>
                    </div>

                    <nav className="flex items-center space-x-4">
                        <a
                            href="/dashboard"
                            className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Dashboard
                        </a>
                        <a
                            href="/calculator"
                            className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Calculadora
                        </a>
                        <a
                            href="#"
                            className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Cotações
                        </a>
                        <a
                            href="#"
                            className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Histórico
                        </a>
                        <button
                            onClick={handleLogout}
                            className="btn-secondary text-sm"
                        >
                            Sair
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    )
}
