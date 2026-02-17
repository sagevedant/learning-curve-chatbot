import { useState, useEffect } from 'react';
import './index.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem('lc_admin_auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = () => setIsAuthenticated(true);

    const handleLogout = () => {
        localStorage.removeItem('lc_admin_auth');
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} />;
    }

    return <Dashboard onLogout={handleLogout} />;
}

export default App;
