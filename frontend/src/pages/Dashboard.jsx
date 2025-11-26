import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

export default function Dashboard() {
    const navigate = useNavigate()

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/login')
        }
    }, [navigate])

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        FreteMaster MVP 🚀
                    </h1>
                    <p className="text-xl text-gray-600">
                        Sistema de Cálculo de Frete com Múltiplas Transportadoras
                    </p>
                    {localStorage.getItem('user') && (
                        <p className="mt-2 text-primary-600">
                            Olá, {JSON.parse(localStorage.getItem('user')).nome}!
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="card text-center">
                        <div className="text-3xl mb-2">📦</div>
                        <h3 className="font-semibold text-gray-900 mb-1">Correios</h3>
                        <p className="text-sm text-gray-600">Integração ativa</p>
                    </div>

                    <div className="card text-center">
                        <div className="text-3xl mb-2">🚚</div>
                        <h3 className="font-semibold text-gray-900 mb-1">Jadlog</h3>
                        <p className="text-sm text-gray-600">Integração ativa</p>
                    </div>

                    <div className="card text-center">
                        <div className="text-3xl mb-2">🚛</div>
                        <h3 className="font-semibold text-gray-900 mb-1">Braspress</h3>
                        <p className="text-sm text-gray-600">Integração ativa</p>
                    </div>

                    <div className="card text-center">
                        <div className="text-3xl mb-2">🏃</div>
                        <h3 className="font-semibold text-gray-900 mb-1">São Miguel</h3>
                        <p className="text-sm text-gray-600">Integração ativa</p>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Bem-vindo ao FreteMaster!
                    </h2>
                    <div className="space-y-3 text-gray-700">
                        <p>✅ Backend API configurado e rodando</p>
                        <p>✅ Banco de dados PostgreSQL conectado</p>
                        <p>✅ Autenticação JWT implementada</p>
                        <p>✅ 4 transportadoras integradas (mock)</p>
                        <p>✅ Interface responsiva com TailwindCSS</p>
                    </div>

                    <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                        <p className="text-sm text-primary-800">
                            <strong>Próximos passos:</strong> Implementar formulário de cotação,
                            integração real com APIs das transportadoras e histórico de cotações.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
