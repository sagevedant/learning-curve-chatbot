import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];

export default function Charts({ analytics }) {
    // Program pie chart data
    const programData = Object.entries(analytics.byProgram || {}).map(([name, value]) => ({
        name,
        value,
    }));

    // Day of week bar chart data
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayData = dayOrder.map(day => ({
        name: day.slice(0, 3),
        leads: (analytics.byDayOfWeek || {})[day] || 0,
    }));

    // Peak hours line chart data
    const hourData = Object.entries(analytics.peakHours || {})
        .map(([hour, count]) => ({
            name: `${hour}:00`,
            leads: count,
        }))
        .filter(d => d.leads > 0 || (parseInt(d.name) >= 8 && parseInt(d.name) <= 20));

    if (programData.length === 0 && dayData.every(d => d.leads === 0)) {
        return (
            <div className="bg-white rounded-2xl shadow-lg shadow-black/5 border border-gray-50 p-8 text-center text-gray-400">
                Charts will appear once you have some leads! 📊
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leads by Program */}
            {programData.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg shadow-black/5 border border-gray-50 p-6">
                    <h3 className="font-semibold text-dark mb-4">Leads by Program</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={programData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={4}
                                dataKey="value"
                            >
                                {programData.map((entry, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Leads by Day of Week */}
            <div className="bg-white rounded-2xl shadow-lg shadow-black/5 border border-gray-50 p-6">
                <h3 className="font-semibold text-dark mb-4">Leads by Day of Week</h3>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={dayData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="leads" fill="#4ECDC4" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Peak Hours */}
            {hourData.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg shadow-black/5 border border-gray-50 p-6 lg:col-span-2">
                    <h3 className="font-semibold text-dark mb-4">Peak Inquiry Hours</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={hourData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="leads" fill="#FF6B6B" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
