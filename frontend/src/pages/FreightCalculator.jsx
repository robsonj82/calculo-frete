import { useState } from 'react'
import api from '../services/api'

export default function FreightCalculator() {
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        weight: '',
        height: '',
        width: '',
        length: '',
        declared_value: '',
        service_type: 'normal'
    })
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleCalculate = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setResults([])

        try {
            const response = await api.post('/freight/calculate', {
                ...formData,
                weight: parseFloat(formData.weight),
                height: parseFloat(formData.height),
                width: parseFloat(formData.width),
                length: parseFloat(formData.length),
                declared_value: parseFloat(formData.declared_value)
            })
            setResults(response.data.data)
        } catch (err) {
            console.error('Calculation error:', err)
            setError('Erro ao calcular frete. Verifique os dados e tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    const getBestOption = (type) => {
        if (results.length === 0) return null

        if (type === 'price') {
            return results.reduce((min, p) => p.price < min.price ? p : min, results[0])
        }
        if (type === 'deadline') {
            return results.reduce((min, p) => p.deadline < min.deadline ? p : min, results[0])
        }
        return null
    }

    const bestPrice = getBestOption('price')
    const bestDeadline = getBestOption('deadline')

    const handleSave = async (result) => {
        try {
            await api.post('/history', {
                ...formData,
                weight: parseFloat(formData.weight),
                dimensions: `${formData.height}x${formData.width}x${formData.length}`,
                value: parseFloat(formData.declared_value),
                carrier: result.carrier,
                service: result.service,
                price: result.price,
                deadline: result.deadline
            })
            alert('Cotação salva no histórico!')
        } catch (err) {
            console.error('Error saving history:', err)
            alert('Erro ao salvar cotação.')
        }
    }

    const handleSave = async (result) => {
        try {
            await api.post('/history', {
                ...formData,
                weight: parseFloat(formData.weight),
                dimensions: `${formData.height}x${formData.width}x${formData.length}`,
                value: parseFloat(formData.declared_value),
                carrier: result.carrier,
                service: result.service,
                price: result.price,
                deadline: result.deadline
            })
            alert('Cotação salva no histórico!')
        } catch (err) {
            console.error('Error saving history:', err)
            alert('Erro ao salvar cotação.')
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Calculadora de Frete</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className="card">
                        <form onSubmit={handleCalculate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CEP Origem</label>
                                    <input
                                        type="text"
                                        name="origin"
                                        value={formData.origin}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="00000-000"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CEP Destino</label>
                                    <input
                                        type="text"
                                        name="destination"
                                        value={formData.destination}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="00000-000"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="0.0"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor Decl. (R$)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="declared_value"
                                        value={formData.declared_value}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Alt (cm)</label>
                                    <input
                                        type="number"
                                        name="height"
                                        value={formData.height}
                                        onChange={handleChange}
                                        className="input-field px-2"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Larg (cm)</label>
                                    <input
                                        type="number"
                                        name="width"
                                        value={formData.width}
                                        onChange={handleChange}
                                        className="input-field px-2"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Comp (cm)</label>
                                    <input
                                        type="number"
                                        name="length"
                                        value={formData.length}
                                        onChange={handleChange}
                                        className="input-field px-2"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary mt-4"
                            >
                                {loading ? 'Calculando...' : 'Calcular Frete'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-2">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                    <div className="text-sm text-green-800 font-semibold mb-1">Mais Barato 💰</div>
                                    <div className="text-2xl font-bold text-green-900">
                                        R$ {bestPrice.price.toFixed(2)}
                                    </div>
                                    <div className="text-sm text-green-700">
                                        {bestPrice.carrier} - {bestPrice.service}
                                    </div>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                    <div className="text-sm text-blue-800 font-semibold mb-1">Mais Rápido ⚡</div>
                                    <div className="text-2xl font-bold text-blue-900">
                                        {bestDeadline.deadline} dias
                                    </div>
                                    <div className="text-sm text-blue-700">
                                        {bestDeadline.carrier} - {bestDeadline.service}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transportadora</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prazo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {results.map((result, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {result.carrier}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {result.service}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {result.deadline} dias
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                    R$ {result.price.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => handleSave(result)}
                                                        className="text-primary-600 hover:text-primary-800 font-medium"
                                                    >
                                                        Selecionar
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => handleSave(result)}
                                                        className="text-primary-600 hover:text-primary-800 font-medium"
                                                    >
                                                        Selecionar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {results.length === 0 && !loading && !error && (
                        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            Preencha o formulário para ver as cotações
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
