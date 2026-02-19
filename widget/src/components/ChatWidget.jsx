import { useState, useEffect, useRef } from 'react';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';
import useConversation from '../hooks/useConversation';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);
    const [showBadge, setShowBadge] = useState(false);
    const hasTriggeredExit = useRef(false);

    const {
        messages,
        options,
        inputType,
        inputPlaceholder,
        loading,
        startConversation,
        sendMessage,
        sendFreeformMessage,
    } = useConversation();

    const openChat = () => {
        setIsOpen(true);
        setShowBadge(false);
        if (!hasOpened) {
            setHasOpened(true);
            startConversation();
        }
    };

    const handleToggle = () => {
        if (!isOpen) {
            openChat();
        } else {
            setIsOpen(false);
        }
    };

    // ── Auto-open after 5 seconds on first visit ──
    useEffect(() => {
        const alreadySeen = sessionStorage.getItem('lc_chat_opened');
        if (alreadySeen) return;

        // Show notification badge after 3s
        const badgeTimer = setTimeout(() => {
            if (!isOpen) setShowBadge(true);
        }, 3000);

        // Auto-open after 5s
        const openTimer = setTimeout(() => {
            if (!isOpen) {
                openChat();
                sessionStorage.setItem('lc_chat_opened', 'true');
            }
        }, 5000);

        return () => {
            clearTimeout(badgeTimer);
            clearTimeout(openTimer);
        };
    }, []);

    // ── Exit intent detection ──
    // Triggers when mouse moves toward the top of the page (about to close tab)
    useEffect(() => {
        const handleMouseLeave = (e) => {
            // Only trigger when mouse leaves from the top of the viewport
            if (
                e.clientY <= 5 &&
                !isOpen &&
                !hasTriggeredExit.current
            ) {
                hasTriggeredExit.current = true;
                openChat();
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [isOpen, hasOpened]);

    return (
        <>
            {isOpen && (
                <ChatWindow
                    messages={messages}
                    options={options}
                    inputType={inputType}
                    inputPlaceholder={inputPlaceholder}
                    loading={loading}
                    onSelectOption={sendMessage}
                    onSubmitInput={sendMessage}
                    onSendFreeform={sendFreeformMessage}
                    onClose={() => setIsOpen(false)}
                />
            )}
            <ChatButton onClick={handleToggle} isOpen={isOpen} showBadge={showBadge} />
        </>
    );
}
