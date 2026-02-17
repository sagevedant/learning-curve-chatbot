import { useState, useEffect } from 'react';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';
import useConversation from '../hooks/useConversation';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);

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

    const handleToggle = () => {
        if (!isOpen) {
            setIsOpen(true);
            if (!hasOpened) {
                setHasOpened(true);
                startConversation();
            }
        } else {
            setIsOpen(false);
        }
    };

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
            <ChatButton onClick={handleToggle} isOpen={isOpen} />
        </>
    );
}
