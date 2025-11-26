import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import FreightCalculator from './pages/FreightCalculator'
import History from './pages/History'
import Integrations from './pages/Integrations'
import WooCommerce from './pages/WooCommerce'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/calculator" element={<FreightCalculator />} />
                <Route path="/history" element={<History />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/woocommerce" element={<WooCommerce />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    )
}

export default App
