/**
 * Optional Ollama integration for free-form questions.
 * If Ollama isn't available, falls back to a polite redirect.
 */

const SCHOOL_SYSTEM_PROMPT = `You are a friendly admissions assistant for Learning Curve Preschool in Viman Nagar, Pune.

ABOUT THE SCHOOL:
- Location: Viman Nagar, Pune 411014
- Programs: Playgroup (1.5-2.5yrs), Nursery (2.5-3.5yrs), Junior KG (3.5-4.5yrs), Senior KG (4.5-6yrs), Daycare (1.5-6yrs)
- Timings: 9AM-12PM / 12:30-3:30PM
- Daycare: 8AM-6PM
- Days: Monday to Saturday

YOUR PERSONALITY:
- Warm, caring, patient
- Speak like a friendly teacher
- Use simple language
- Occasional emojis (not too many)
- Short responses (2-3 lines max)

YOUR GOALS:
- Answer questions confidently
- Always try to encourage a school visit
- Never make up fee information
- If unsure, say the team will call them

NEVER:
- Make up specific fee amounts
- Promise things you're not sure about
- Give long robotic responses`;

let ollamaClient = null;

async function initOllama() {
    try {
        const { Ollama } = require('ollama');
        ollamaClient = new Ollama({
            host: process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
        });
        // Test connection
        await ollamaClient.list();
        console.log('✅ Ollama connected — free-form AI responses enabled');
        return true;
    } catch (err) {
        console.log('ℹ️  Ollama not available — free-form questions will use fallback responses');
        ollamaClient = null;
        return false;
    }
}

// Initialize on load
initOllama();

/**
 * Get a response for a free-form user question.
 */
async function getFreeformResponse(userMessage) {
    if (ollamaClient) {
        try {
            const model = process.env.OLLAMA_MODEL || 'llama3';
            const response = await ollamaClient.chat({
                model,
                messages: [
                    { role: 'system', content: SCHOOL_SYSTEM_PROMPT },
                    { role: 'user', content: userMessage }
                ],
                options: {
                    temperature: 0.7,
                    num_predict: 150,
                }
            });
            return response.message.content;
        } catch (err) {
            console.error('Ollama error:', err.message);
        }
    }

    // Fallback — no AI available
    return "That's a great question! 😊 Our admissions team can give you the best answer. Would you like us to call you, or feel free to reach us at our school directly!";
}

module.exports = { getFreeformResponse };
