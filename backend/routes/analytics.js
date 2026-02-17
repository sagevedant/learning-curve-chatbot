const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// Auth middleware
function requireApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!process.env.ADMIN_API_KEY || apiKey === process.env.ADMIN_API_KEY) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
}

/**
 * GET /api/analytics
 * Returns lead analytics for the admin dashboard.
 */
router.get('/', requireApiKey, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({
                total: 0,
                byStatus: {},
                byProgram: {},
                byDayOfWeek: {},
                peakHours: {},
                conversionRate: 0,
            });
        }

        // Fetch all leads
        const { data: leads, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Analytics query error:', error);
            return res.status(500).json({ error: 'Failed to fetch analytics' });
        }

        const allLeads = leads || [];
        const total = allLeads.length;

        // By status
        const byStatus = {};
        allLeads.forEach(l => {
            byStatus[l.status || 'new'] = (byStatus[l.status || 'new'] || 0) + 1;
        });

        // By program
        const byProgram = {};
        allLeads.forEach(l => {
            const p = l.program_interest || 'Not specified';
            byProgram[p] = (byProgram[p] || 0) + 1;
        });

        // By day of week
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const byDayOfWeek = {};
        dayNames.forEach(d => byDayOfWeek[d] = 0);
        allLeads.forEach(l => {
            const day = dayNames[new Date(l.created_at).getDay()];
            byDayOfWeek[day]++;
        });

        // Peak hours
        const peakHours = {};
        for (let i = 0; i < 24; i++) peakHours[i] = 0;
        allLeads.forEach(l => {
            const hour = new Date(l.created_at).getHours();
            peakHours[hour]++;
        });

        // Conversion rate
        const admitted = allLeads.filter(l => l.status === 'admitted').length;
        const conversionRate = total > 0 ? Math.round((admitted / total) * 100) : 0;

        // New today
        const today = new Date().toISOString().slice(0, 10);
        const newToday = allLeads.filter(l => l.created_at?.slice(0, 10) === today).length;

        res.json({
            total,
            newToday,
            byStatus,
            byProgram,
            byDayOfWeek,
            peakHours,
            conversionRate,
        });

    } catch (err) {
        console.error('Analytics error:', err);
        res.status(500).json({ error: 'Failed to compute analytics' });
    }
});

module.exports = router;
