/**
 * Widget entry point for embeddable script tag usage.
 * Generates a self-contained <script src="widget.js"></script> bundle.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatWidget from './components/ChatWidget';
import './fonts.css';
import './index.css';

// Create container if it doesn't exist
let container = document.getElementById('learning-curve-chat-root');
if (!container) {
    container = document.createElement('div');
    container.id = 'learning-curve-chat-root';
    document.body.appendChild(container);
}

ReactDOM.createRoot(container).render(
    <React.StrictMode>
        <ChatWidget />
    </React.StrictMode>
);
