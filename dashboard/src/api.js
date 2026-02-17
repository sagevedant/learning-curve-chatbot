const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_KEY = import.meta.env.VITE_ADMIN_API_KEY || '';

export async function fetchLeads(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.program) params.set('program', filters.program);
    if (filters.date_from) params.set('date_from', filters.date_from);
    if (filters.date_to) params.set('date_to', filters.date_to);

    const res = await fetch(`${API_URL}/api/leads?${params}`, {
        headers: { 'x-api-key': API_KEY },
    });
    if (!res.ok) throw new Error('Failed to fetch leads');
    return res.json();
}

export async function updateLeadStatus(id, status) {
    const res = await fetch(`${API_URL}/api/leads/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
        },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update lead');
    return res.json();
}

export async function fetchAnalytics() {
    const res = await fetch(`${API_URL}/api/analytics`, {
        headers: { 'x-api-key': API_KEY },
    });
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
}
