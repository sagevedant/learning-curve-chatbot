export default function ChatButton({ onClick, isOpen, showBadge }) {
    return (
        <div className="fixed bottom-5 right-5 z-[999999]">
            {/* Pulse ring */}
            {!isOpen && (
                <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
            )}

            <button
                onClick={onClick}
                className={`
          relative w-[60px] h-[60px] rounded-full
          bg-gradient-to-br from-primary to-[#FF5252]
          shadow-lg shadow-primary/30
          flex items-center justify-center
          transition-all duration-300 ease-out
          hover:scale-110 hover:shadow-xl hover:shadow-primary/40
          active:scale-95
          ${isOpen ? 'rotate-0' : 'animate-bounce-in'}
        `}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? (
                    /* Close icon */
                    <svg className="w-6 h-6 text-white transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    /* Chat icon */
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                )}

                {/* Notification badge */}
                {showBadge && !isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce shadow-md">
                        1
                    </span>
                )}
            </button>

            {/* Preview message bubble */}
            {showBadge && !isOpen && (
                <div
                    onClick={onClick}
                    className="absolute bottom-[70px] right-0 bg-white rounded-2xl rounded-br-sm shadow-xl p-3 pr-4 cursor-pointer hover:shadow-2xl transition-shadow max-w-[220px] animate-slide-up"
                >
                    <p className="text-sm text-gray-700 font-medium leading-snug">
                        👋 Hi! Looking for the best preschool for your child?
                    </p>
                    <div className="absolute bottom-0 right-2 w-3 h-3 bg-white transform rotate-45 translate-y-1.5" />
                </div>
            )}
        </div>
    );
}
