const express = require('express');
const router = express.Router();
const { processStep } = require('../lib/conversation-engine');
const { getFreeformResponse } = require('../lib/ollama');

/**
 * POST /api/chat
 * Process a conversation step or free-form message.
 * Body: { step: string, message: string, data: object }
 */
router.post('/', async (req, res) => {
    try {
        const { step, message, data } = req.body;

        // If no step provided, start the conversation
        if (!step || step === 'init') {
            const result = processStep('welcome', null, {});
            return res.json(result);
        }

        // If step is 'freeform', use Ollama or fallback
        if (step === 'freeform') {
            const aiResponse = await getFreeformResponse(message);
            return res.json({
                message: aiResponse,
                options: ["Programs & Age Groups", "Book a Visit", "Back to Menu"],
                nextStep: 'browsing_response',
                data: data || {},
            });
        }

        // Process the guided flow step
        const result = processStep(step, message, data || {});
        return res.json(result);

    } catch (err) {
        console.error('Chat error:', err);
        res.status(500).json({
            message: "Oops! Something went wrong. Please try again or call us directly at +91 98765 43210 📞",
            nextStep: 'welcome',
            data: {},
        });
    }
});

module.exports = router;
