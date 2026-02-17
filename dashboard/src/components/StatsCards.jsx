export default function StatsCards({ analytics }) {
    const cards = [
        {
            label: 'Total Leads',
            value: analytics.total || 0,
            icon: '👥',
            color: 'from-blue-500 to-blue-600',
            shadow: 'shadow-blue-500/20',
        },
        {
            label: 'New Today',
            value: analytics.newToday || 0,
            icon: '🆕',
            color: 'from-secondary to-teal-500',
            shadow: 'shadow-secondary/20',
        },
        {
            label: 'Visited',
            value: analytics.byStatus?.visited || 0,
            icon: '🏫',
            color: 'from-amber-500 to-orange-500',
            shadow: 'shadow-amber-500/20',
        },
        {
            label: 'Admitted',
            value: analytics.byStatus?.admitted || 0,
            icon: '🎓',
            color: 'from-primary to-red-500',
            shadow: 'shadow-primary/20',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, i) => (
                <div
                    key={i}
                    className={`bg-white rounded-2xl p-5 shadow-lg ${card.shadow} border border-gray-50 hover:shadow-xl transition-shadow`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl">{card.icon}</span>
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} opacity-10`} />
                    </div>
                    <p className="text-3xl font-bold text-dark">{card.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{card.label}</p>
                </div>
            ))}
        </div>
    );
}
