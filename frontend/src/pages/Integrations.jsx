import { useState } from 'react'

export default function Integrations() {
    const [secret, setSecret] = useState('fretemaster_secret')
    const webhookUrl = `${window.location.protocol}//${window.location.hostname}:4000/integrations/woocommerce/webhook`

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        alert('Copiado para a área de transferência!')
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Integrações</h1>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">WooCommerce</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Configure o Webhook no seu WooCommerce para calcular fretes automaticamente.
                    </p>
                </div>
                <div className="px-6 py-5 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL de Entrega (Webhook URL)</label>
                        <div className="flex rounded-md shadow-sm">
                            <input
                                type="text"
                                readOnly
                                value={webhookUrl}
                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => copyToClipboard(webhookUrl)}
                                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
                            >
                                Copiar
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Segredo (Secret)</label>
                        <div className="flex rounded-md shadow-sm">
                            <input
                                type="text"
                                readOnly
                                value={secret}
                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => copyToClipboard(secret)}
                                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
                            >
                                Copiar
                            </button>
                        </div>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    No WooCommerce, vá em <strong>Configurações &gt; Avançado &gt; Webhooks</strong>.
                                    Crie um novo webhook com o tópico <strong>"Pedido criado"</strong> e use os dados acima.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
