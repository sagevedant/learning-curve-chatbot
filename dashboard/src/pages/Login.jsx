import { useState } from 'react';

export default function Login({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simple password check — in production, verify server-side
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

        setTimeout(() => {
            if (password === adminPassword) {
                localStorage.setItem('lc_admin_auth', 'true');
                onLogin();
            } else {
                setError('Invalid password');
            }
            setLoading(false);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo area */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-dark">Learning Curve</h1>
                    <p className="text-gray-500 mt-1">Admin Dashboard</p>
                </div>

                {/* Login card */}
                <div className="bg-white rounded-2xl shadow-xl shadow-black/5 p-8">
                    <h2 className="text-lg font-semibold text-dark mb-6">Sign in to continue</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                placeholder="Enter admin password"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-dark outline-none focus:border-secondary transition-colors placeholder:text-gray-400"
                                autoFocus
                            />
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !password}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
