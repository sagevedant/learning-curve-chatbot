/**
 * Rule-based conversation engine for Curious Learners Preschool.
 * Handles the complete guided flow without any AI — all responses are predefined.
 */

const SCHOOL_INFO = {
    name: 'Curious Learners Preschool',
    location: 'Viman Nagar, Pune - 411014',
    phone: '+91 98765 43210',
    hours: 'Mon-Sat: 9 AM to 5 PM',
    programs: {
        playgroup: { name: 'Playgroup', ages: '1.5 - 2.5 years', emoji: '🌱' },
        nursery: { name: 'Nursery', ages: '2.5 - 3.5 years', emoji: '🌸' },
        juniorkg: { name: 'Junior KG', ages: '3.5 - 4.5 years', emoji: '⭐' },
        seniorkg: { name: 'Senior KG', ages: '4.5 - 6 years', emoji: '🚀' },
    },
    timings: {
        morning: '9:00 AM - 12:00 PM',
        afternoon: '12:30 PM - 3:30 PM',
        daycare: '8:00 AM - 6:00 PM',
    }
};

const AGE_TO_PROGRAM = {
    '1.5 - 2.5 years': 'playgroup',
    '2.5 - 3.5 years': 'nursery',
    '3.5 - 4.5 years': 'juniorkg',
    '4.5 - 6 years': 'seniorkg',
};

/**
 * Process a conversation step and return the bot response.
 * @param {string} step - Current step identifier
 * @param {string} userMessage - User's selection or text input
 * @param {object} data - Accumulated conversation data
 * @returns {{ message: string, options?: string[], inputType?: string, inputPlaceholder?: string, nextStep: string, data: object }}
 */
function processStep(step, userMessage, data = {}) {
    switch (step) {

        // ─── MAIN FLOW ─────────────────────────────────────────────
        case 'welcome':
            return {
                message: "👋 Hi! Welcome to Curious Learners Preschool, Viman Nagar! I'm here to help you find the perfect program for your little one. Shall we get started?",
                options: ["Yes, Let's Go! 🎉", "Just Browsing"],
                nextStep: 'welcome_response',
                data,
            };

        case 'welcome_response':
            if (userMessage === "Just Browsing") {
                return processStep('browsing_menu', userMessage, data);
            }
            return processStep('ask_age', userMessage, data);

        case 'ask_age':
            return {
                message: "How old is your child? 👶",
                options: ["1.5 - 2.5 years", "2.5 - 3.5 years", "3.5 - 4.5 years", "4.5 - 6 years"],
                nextStep: 'age_response',
                data,
            };

        case 'age_response': {
            const programKey = AGE_TO_PROGRAM[userMessage];
            const program = SCHOOL_INFO.programs[programKey];
            const updatedData = { ...data, childAgeGroup: userMessage, programInterest: program?.name || userMessage };
            return {
                message: `Perfect! Based on your child's age, our ${program?.emoji || ''} **${program?.name || 'program'}** would be ideal!\n\nAre you looking for:`,
                options: ["Half Day (Morning)", "Full Day (Daycare)"],
                nextStep: 'schedule_response',
                data: updatedData,
            };
        }

        case 'schedule_response': {
            const updatedData = { ...data, schedulePreference: userMessage };
            return {
                message: "Would you like to know about our fee structure?",
                options: ["Yes Please", "Maybe Later"],
                nextStep: 'fee_response',
                data: updatedData,
            };
        }

        case 'fee_response':
            if (userMessage === "Yes Please") {
                return {
                    message: "Our fees vary based on the program and batch. Our admissions coordinator will share the complete details during your school visit — it's much clearer in person! 😊\n\nShall I book a visit for you?",
                    options: ["Book a Visit", "Call Me Instead"],
                    nextStep: 'booking_choice',
                    data,
                };
            }
            // Maybe Later → still try to book
            return {
                message: "No worries! Would you like to schedule a visit to see our campus?",
                options: ["Book a Visit", "Call Me Instead", "Not Now"],
                nextStep: 'booking_choice',
                data,
            };

        case 'booking_choice':
            if (userMessage === "Not Now") {
                return {
                    message: `Thank you for your interest in Curious Learners! 🏫\n\nFeel free to reach out anytime:\n📞 ${SCHOOL_INFO.phone}\n📍 ${SCHOOL_INFO.location}\n⏰ ${SCHOOL_INFO.hours}\n\nWe'd love to meet you and your little one! 👶`,
                    nextStep: 'end',
                    data,
                };
            }
            const updatedData = { ...data, inquiryType: userMessage === "Call Me Instead" ? 'callback' : 'visit' };
            return {
                message: "Wonderful! May I know your name? 😊",
                inputType: 'text',
                inputPlaceholder: 'Enter your name',
                nextStep: 'name_response',
                data: updatedData,
            };

        case 'name_response': {
            const updatedData2 = { ...data, parentName: userMessage.trim() };
            return {
                message: `Nice to meet you, ${updatedData2.parentName}! And your phone number? Our team will confirm your visit! 📱`,
                inputType: 'phone',
                inputPlaceholder: 'Enter 10-digit phone number',
                nextStep: 'phone_response',
                data: updatedData2,
            };
        }

        case 'phone_response': {
            const phone = userMessage.replace(/\D/g, '');
            if (phone.length !== 10) {
                return {
                    message: "Please enter a valid 10-digit phone number 📱",
                    inputType: 'phone',
                    inputPlaceholder: 'Enter 10-digit phone number',
                    nextStep: 'phone_response',
                    data,
                };
            }
            const updatedData3 = { ...data, phone };
            return {
                message: "When would you prefer to visit? 📅",
                options: ["This Week", "Next Week", "Just Call Me"],
                nextStep: 'visit_time_response',
                data: updatedData3,
            };
        }

        case 'visit_time_response': {
            const finalData = { ...data, visitPreference: userMessage };
            return {
                message: `🎉 Thank you ${finalData.parentName}!\n\nOur admissions team will call you at ${finalData.phone} within 24 hours to confirm your visit to Curious Learners!\n\n📍 ${SCHOOL_INFO.location}\n📞 ${SCHOOL_INFO.phone}\n⏰ ${SCHOOL_INFO.hours}\n\nWe look forward to meeting you and your little one! 👶`,
                nextStep: 'end',
                data: finalData,
                captureComplete: true,
            };
        }

        // ─── BROWSING FLOW ─────────────────────────────────────────
        case 'browsing_menu':
            return {
                message: "No problem at all! Feel free to explore. Can I answer any quick questions about our programs? 😊",
                options: ["Programs & Age Groups", "School Timings", "Safety & Facilities", "How to Reach Us"],
                nextStep: 'browsing_response',
                data,
            };

        case 'browsing_response':
            switch (userMessage) {
                case 'Programs & Age Groups':
                    return {
                        message: "We offer 4 programs:\n\n🌱 **Playgroup**: 1.5 - 2.5 years\n🌸 **Nursery**: 2.5 - 3.5 years\n⭐ **Junior KG**: 3.5 - 4.5 years\n🚀 **Senior KG**: 4.5 - 6 years\n+ Daycare for all age groups\n\nWhich would you like to know more about?",
                        options: ["Playgroup", "Nursery", "Junior KG", "Senior KG", "Book a Visit"],
                        nextStep: 'program_detail_response',
                        data,
                    };

                case 'School Timings':
                    return {
                        message: `Our timings are:\n\n🕘 **Morning Batch**: ${SCHOOL_INFO.timings.morning}\n🕑 **Afternoon Batch**: ${SCHOOL_INFO.timings.afternoon}\n🌞 **Daycare**: ${SCHOOL_INFO.timings.daycare}\n\nMonday to Saturday\n\nWould you like to book a visit?`,
                        options: ["Book a Visit", "Back to Menu"],
                        nextStep: 'info_action_response',
                        data,
                    };

                case 'Safety & Facilities':
                    return {
                        message: "At Curious Learners we have:\n\n✅ CCTV surveillance\n✅ Female security staff\n✅ Safe pickup/drop protocols\n✅ First aid trained staff\n✅ Nutritionist planned meals\n✅ Clean sanitized classrooms\n\nWould you like to see our facilities in person?",
                        options: ["Book a Visit", "Not Now"],
                        nextStep: 'info_action_response',
                        data,
                    };

                case 'How to Reach Us':
                    return {
                        message: `📍 **Curious Learners School**\n${SCHOOL_INFO.location}\n\n📞 ${SCHOOL_INFO.phone}\n🕘 ${SCHOOL_INFO.hours}\n\nWould you like us to call you?`,
                        options: ["Yes, Call Me", "I'll Call You"],
                        nextStep: 'contact_response',
                        data,
                    };

                default:
                    return processStep('browsing_menu', userMessage, data);
            }

        case 'program_detail_response':
            if (userMessage === 'Book a Visit') {
                return processStep('booking_choice', 'Book a Visit', data);
            }
            // Map selection to age for the main flow
            const programMap = { 'Playgroup': '1.5 - 2.5 years', 'Nursery': '2.5 - 3.5 years', 'Junior KG': '3.5 - 4.5 years', 'Senior KG': '4.5 - 6 years' };
            if (programMap[userMessage]) {
                return processStep('age_response', programMap[userMessage], data);
            }
            return processStep('browsing_menu', userMessage, data);

        case 'info_action_response':
            if (userMessage === 'Book a Visit') {
                return processStep('booking_choice', 'Book a Visit', data);
            }
            return processStep('browsing_menu', userMessage, data);

        case 'contact_response':
            if (userMessage === "Yes, Call Me") {
                const updatedDataContact = { ...data, inquiryType: 'callback' };
                return {
                    message: "Wonderful! May I know your name? 😊",
                    inputType: 'text',
                    inputPlaceholder: 'Enter your name',
                    nextStep: 'name_response',
                    data: updatedDataContact,
                };
            }
            return {
                message: `Great! You can reach us at:\n\n📞 ${SCHOOL_INFO.phone}\n⏰ ${SCHOOL_INFO.hours}\n\nWe look forward to hearing from you! 😊`,
                nextStep: 'end',
                data,
            };

        case 'end':
            return {
                message: "Is there anything else I can help you with?",
                options: ["Start Over", "No, Thank You"],
                nextStep: 'end_response',
                data,
            };

        case 'end_response':
            if (userMessage === "Start Over") {
                return processStep('welcome', null, {});
            }
            return {
                message: `Thank you for chatting with us! 💛\n\n📞 ${SCHOOL_INFO.phone}\n📍 ${SCHOOL_INFO.location}\n\nHave a wonderful day! 🌟`,
                nextStep: 'closed',
                data,
            };

        default:
            return processStep('welcome', null, {});
    }
}

module.exports = { processStep, SCHOOL_INFO };
