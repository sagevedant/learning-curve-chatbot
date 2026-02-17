export default function MessageBubble({ message }) {
    const isBot = message.sender === 'bot';

    // Simple markdown-like bold rendering
    const renderText = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            // Handle line breaks
            return part.split('\n').map((line, j) => (
                <span key={`${i}-${j}`}>
                    {j > 0 && <br />}
                    {line}
                </span>
            ));
        });
    };

    return (
        <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-message-in`}>
            <div
                className={`
          max-w-[85%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed
          ${isBot
                        ? 'bg-[#F7F8FA] text-dark rounded-bl-sm bot-message'
                        : 'bg-gradient-to-br from-primary to-[#FF5252] text-white rounded-br-sm'
                    }
        `}
            >
                {renderText(message.text)}
            </div>
        </div>
    );
}
