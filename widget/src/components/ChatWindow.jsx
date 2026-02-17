import { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import QuickReplies from './QuickReplies';
import TextInput from './TextInput';

function TypingIndicator() {
    return (
        <div className="flex justify-start animate-message-in">
            <div className="bg-[#F7F8FA] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
            </div>
        </div>
    );
}

export default function ChatWindow({
    messages,
    options,
    inputType,
    inputPlaceholder,
    loading,
    onSelectOption,
    onSubmitInput,
    onSendFreeform,
    onClose,
}) {
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading, options]);

    return (
        <div className={`
      fixed bottom-24 right-5 z-[999998]
      w-[380px] h-[580px]
      max-sm:bottom-0 max-sm:right-0 max-sm:w-full max-sm:h-full max-sm:rounded-none
      bg-white rounded-2xl shadow-2xl shadow-black/15
      flex flex-col overflow-hidden
      animate-slide-up
      border border-gray-100
    `}>
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-[#FF5252] px-5 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                    {/* School icon */}
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-[16px] leading-tight">Learning Curve</h3>
                        <p className="text-white/80 text-[12px]">Preschool • Viman Nagar</p>
                    </div>
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                    aria-label="Close chat"
                >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Messages */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 chat-scroll bg-white"
            >
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}

                {loading && <TypingIndicator />}

                {/* Quick replies */}
                {!loading && options.length > 0 && (
                    <QuickReplies options={options} onSelect={onSelectOption} disabled={loading} />
                )}

                {/* Text input */}
                {!loading && inputType && (
                    <TextInput
                        type={inputType}
                        placeholder={inputPlaceholder}
                        onSubmit={onSubmitInput}
                        disabled={loading}
                    />
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Footer - freeform input */}
            <div className="border-t border-gray-100 px-4 py-3 bg-white flex-shrink-0">
                <FreeformInput onSend={onSendFreeform} disabled={loading} />
            </div>
        </div>
    );
}

function FreeformInput({ onSend, disabled }) {
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const val = inputRef.current?.value?.trim();
        if (val) {
            onSend(val);
            inputRef.current.value = '';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                ref={inputRef}
                type="text"
                placeholder="Type a message..."
                disabled={disabled}
                className="flex-1 px-3 py-2 text-[13px] rounded-lg border border-gray-200 bg-gray-50 text-dark placeholder:text-gray-400 outline-none focus:border-secondary transition-colors disabled:opacity-50"
            />
            <button
                type="submit"
                disabled={disabled}
                className="w-9 h-9 rounded-lg bg-secondary text-white flex items-center justify-center hover:bg-secondary-hover transition-colors disabled:opacity-40 flex-shrink-0"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
            </button>
        </form>
    );
}
