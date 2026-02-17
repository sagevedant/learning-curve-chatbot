import { useState } from 'react';
import { updateLeadStatus } from '../api';

const STATUS_COLORS = {
    new: 'bg-blue-100 text-blue-700',
    called: 'bg-yellow-100 text-yellow-700',
    visited: 'bg-purple-100 text-purple-700',
    admitted: 'bg-green-100 text-green-700',
    lost: 'bg-gray-100 text-gray-500',
};

const STATUSES = ['new', 'called', 'visited', 'admitted', 'lost'];

export default function LeadsTable({ leads, onRefresh }) {
    const [updating, setUpdating] = useState(null);

    const handleStatusChange = async (id, newStatus) => {
        setUpdating(id);
        try {
            await updateLeadStatus(id, newStatus);
            onRefresh();
        } catch (err) {
            console.error('Failed to update status:', err);
        }
        setUpdating(null);
    };

    const exportCSV = () => {
        const headers = ['Name', 'Phone', 'Age Group', 'Program', 'Visit Preference', 'Status', 'Date'];
        const rows = leads.map(l => [
            l.parent_name,
            l.phone,
            l.child_age_group || '',
            l.program_interest || '',
            l.visit_preference || '',
            l.status,
            new Date(l.created_at).toLocaleDateString('en-IN'),
        ]);

        const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `learning-curve-leads-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg shadow-black/5 border border-gray-50 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <h3 className="font-semibold text-dark text-lg">All Leads</h3>
                <button
                    onClick={exportCSV}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
                >
                    📥 Export CSV
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50/80">
                            <th className="text-left px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Parent</th>
                            <th className="text-left px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Phone</th>
                            <th className="text-left px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Age Group</th>
                            <th className="text-left px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Program</th>
                            <th className="text-left px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Visit</th>
                            <th className="text-left px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                            <th className="text-left px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {leads.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-12 text-gray-400">
                                    No leads yet. They'll appear here once parents start chatting! 🎉
                                </td>
                            </tr>
                        ) : (
                            leads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-dark">{lead.parent_name}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <a href={`tel:${lead.phone}`} className="hover:text-primary transition-colors">
                                            {lead.phone}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{lead.child_age_group || '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                            {lead.program_interest || '—'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{lead.visit_preference || '—'}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={lead.status || 'new'}
                                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                            disabled={updating === lead.id}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-0 outline-none cursor-pointer ${STATUS_COLORS[lead.status] || STATUS_COLORS.new} ${updating === lead.id ? 'opacity-50' : ''}`}
                                        >
                                            {STATUSES.map(s => (
                                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                        {new Date(lead.created_at).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit',
                                        })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
