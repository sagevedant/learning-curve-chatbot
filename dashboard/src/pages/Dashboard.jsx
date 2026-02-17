import { useState, useEffect, useCallback } from 'react';
import { fetchLeads, fetchAnalytics } from '../api';
import StatsCards from '../components/StatsCards';
import LeadsTable from '../components/LeadsTable';
import Charts from '../components/Charts';

export default function Dashboard({ onLogout }) {
    const [leads, setLeads] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: '', program: '' });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [leadsData, analyticsData] = await Promise.all([
                fetchLeads(filters),
                fetchAnalytics(),
            ]);
            setLeads(leadsData.leads || []);
            setAnalytics(analyticsData);
        } catch (err) {
            console.error('Failed to load data:', err);
        }
        setLoading(false);
    }, [filters]);

    useEffect(() => {
        loadData();
        // Auto-refresh every 30 seconds
        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, [loadData]);

    return (
        <div className="min-h-screen bg-[#F0F2F5]">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-dark">Learning Curve</h1>
                            <p className="text-xs text-gray-500">Admin Dashboard</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Conversion rate badge */}
                        {analytics.conversionRate > 0 && (
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                                <span className="text-xs text-green-600 font-medium">Conversion: {analytics.conversionRate}%</span>
                            </div>
                        )}

                        <button
                            onClick={onLogout}
                            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors rounded-lg hover:bg-gray-50"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                {/* Stats */}
                <StatsCards analytics={analytics} />

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                        className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm text-dark outline-none focus:border-secondary cursor-pointer"
                    >
                        <option value="">All Statuses</option>
                        <option value="new">New</option>
                        <option value="called">Called</option>
                        <option value="visited">Visited</option>
                        <option value="admitted">Admitted</option>
                        <option value="lost">Lost</option>
                    </select>

                    <select
                        value={filters.program}
                        onChange={(e) => setFilters(f => ({ ...f, program: e.target.value }))}
                        className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm text-dark outline-none focus:border-secondary cursor-pointer"
                    >
                        <option value="">All Programs</option>
                        <option value="Playgroup">Playgroup</option>
                        <option value="Nursery">Nursery</option>
                        <option value="Junior KG">Junior KG</option>
                        <option value="Senior KG">Senior KG</option>
                    </select>

                    <button
                        onClick={loadData}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl bg-secondary text-white text-sm font-medium hover:bg-secondary/90 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : '🔄 Refresh'}
                    </button>
                </div>

                {/* Leads Table */}
                <LeadsTable leads={leads} onRefresh={loadData} />

                {/* Charts */}
                <Charts analytics={analytics} />
            </main>
        </div>
    );
}
