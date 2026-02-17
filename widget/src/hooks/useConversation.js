import { useState, useRef, useEffect, useCallback } from 'react';
import config from '../config';

const API = config.apiBaseUrl;

export default function useConversation() {
    const [messages, setMessages] = useState([]);
    const [currentStep, setCurrentStep] = useState('init');
    const [options, setOptions] = useState([]);
    const [inputType, setInputType] = useState(null);
    const [inputPlaceholder, setInputPlaceholder] = useState('');
    const [loading, setLoading] = useState(false);
    const [conversationData, setConversationData] = useState({});
    const [leadCaptured, setLeadCaptured] = useState(false);

    const addMessage = useCallback((text, sender = 'bot') => {
        setMessages(prev => [...prev, { text, sender, id: Date.now() + Math.random() }]);
    }, []);

    const processResponse = useCallback((data) => {
        if (data.message) {
            addMessage(data.message, 'bot');
        }
        setOptions(data.options || []);
        setInputType(data.inputType || null);
        setInputPlaceholder(data.inputPlaceholder || '');
        setCurrentStep(data.nextStep || 'end');
        if (data.data) {
            setConversationData(data.data);
        }

        // If lead capture is complete, submit the lead
        if (data.captureComplete && data.data) {
            submitLead(data.data);
        }
    }, []);

    const submitLead = async (data) => {
        try {
            await fetch(`${API}/api/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    parent_name: data.parentName,
                    phone: data.phone,
                    child_age_group: data.childAgeGroup,
                    program_interest: data.programInterest,
                    visit_preference: data.visitPreference,
                    inquiry_type: data.inquiryType || 'visit',
                    conversation: messages.map(m => ({ role: m.sender, text: m.text })),
                }),
            });
            setLeadCaptured(true);
        } catch (err) {
            console.error('Failed to submit lead:', err);
        }
    };

    const startConversation = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ step: 'init' }),
            });
            const data = await res.json();
            processResponse(data);
        } catch (err) {
            addMessage(`👋 Hi! Welcome to Learning Curve Preschool! I'm having a little trouble connecting right now. Please call us at ${config.school.phone} — we'd love to chat! 📞`, 'bot');
        } finally {
            setLoading(false);
        }
    }, []);

    const sendMessage = useCallback(async (userMessage) => {
        if (!userMessage?.trim()) return;

        addMessage(userMessage, 'user');
        setOptions([]);
        setInputType(null);
        setLoading(true);

        try {
            const res = await fetch(`${API}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    step: currentStep,
                    message: userMessage,
                    data: conversationData,
                }),
            });
            const data = await res.json();

            // Small delay for natural feel
            await new Promise(r => setTimeout(r, 600));
            processResponse(data);
        } catch (err) {
            addMessage(`Oops! Something went wrong. Please call us at ${config.school.phone} 📞`, 'bot');
        } finally {
            setLoading(false);
        }
    }, [currentStep, conversationData]);

    const sendFreeformMessage = useCallback(async (userMessage) => {
        if (!userMessage?.trim()) return;

        addMessage(userMessage, 'user');
        setOptions([]);
        setLoading(true);

        try {
            const res = await fetch(`${API}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    step: 'freeform',
                    message: userMessage,
                    data: conversationData,
                }),
            });
            const data = await res.json();
            await new Promise(r => setTimeout(r, 800));
            processResponse(data);
        } catch (err) {
            addMessage(`That's a great question! Please call us at ${config.school.phone} and our team will help you out! 😊`, 'bot');
        } finally {
            setLoading(false);
        }
    }, [conversationData]);

    const resetConversation = useCallback(() => {
        setMessages([]);
        setCurrentStep('init');
        setOptions([]);
        setInputType(null);
        setConversationData({});
        setLeadCaptured(false);
        startConversation();
    }, [startConversation]);

    return {
        messages,
        options,
        inputType,
        inputPlaceholder,
        loading,
        leadCaptured,
        currentStep,
        startConversation,
        sendMessage,
        sendFreeformMessage,
        resetConversation,
    };
}
