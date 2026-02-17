const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { sendEmailNotification } = require('../lib/notifications');

// Auth middleware for protected routes
function requireApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!process.env.ADMIN_API_KEY || apiKey === process.env.ADMIN_API_KEY) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
}

/**
 * POST /api/leads
 * Create a new lead from chatbot conversation.
 */
router.post('/', async (req, res) => {
    try {
        const { parent_name, phone, child_age_group, program_interest, visit_preference, inquiry_type, conversation } = req.body;

        if (!parent_name || !phone) {
            return res.status(400).json({ error: 'Name and phone are required' });
        }

        const lead = {
            parent_name,
            phone,
            child_age_group: child_age_group || null,
            program_interest: program_interest || null,
            visit_preference: visit_preference || null,
            inquiry_type: inquiry_type || 'visit',
            status: 'new',
            conversation: conversation || null,
            created_at: new Date().toISOString(),
        };

        // Store in Supabase if available
        let savedLead = { ...lead, id: `local-${Date.now()}` };

        if (supabase) {
            const { data, error } = await supabase
                .from('leads')
                .insert([lead])
                .select()
                .single();

            if (error) {
                console.error('Supabase insert error:', error);
            } else {
                savedLead = data;
            }
        } else {
            console.log('📋 Lead captured (no database):', JSON.stringify(lead, null, 2));
        }

        // Send email notification (async, don't block response)
        sendEmailNotification(savedLead).catch(err => {
            console.error('Notification error:', err);
        });

        res.status(201).json({
            success: true,
            id: savedLead.id,
            message: 'Lead captured successfully',
        });

    } catch (err) {
        console.error('Lead capture error:', err);
        res.status(500).json({ error: 'Failed to save lead' });
    }
});

/**
 * GET /api/leads
 * List leads with optional filters. Protected by API key.
 */
router.get('/', requireApiKey, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ leads: [], message: 'Database not configured' });
        }

        const { status, program, date_from, date_to, page = 1, limit = 50 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        let query = supabase
            .from('leads')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + parseInt(limit) - 1);

        if (status) query = query.eq('status', status);
        if (program) query = query.eq('program_interest', program);
        if (date_from) query = query.gte('created_at', date_from);
        if (date_to) query = query.lte('created_at', date_to);

        const { data, error, count } = await query;

        if (error) {
            console.error('Supabase query error:', error);
            return res.status(500).json({ error: 'Failed to fetch leads' });
        }

        res.json({
            leads: data || [],
            total: count || 0,
            page: parseInt(page),
            limit: parseInt(limit),
        });

    } catch (err) {
        console.error('Get leads error:', err);
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
});

/**
 * PUT /api/leads/:id
 * Update lead status.
 */
router.put('/:id', requireApiKey, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['new', 'called', 'visited', 'admitted', 'lost'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
        }

        if (!supabase) {
            return res.json({ success: true, message: 'Database not configured' });
        }

        const { data, error } = await supabase
            .from('leads')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Supabase update error:', error);
            return res.status(500).json({ error: 'Failed to update lead' });
        }

        res.json({ success: true, lead: data });

    } catch (err) {
        console.error('Update lead error:', err);
        res.status(500).json({ error: 'Failed to update lead' });
    }
});

module.exports = router;
