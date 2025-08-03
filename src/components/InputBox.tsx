import React, { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';

interface InputBoxProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const InputBox: React.FC<InputBoxProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '56px';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 160;
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="bg-white/98 backdrop-blur-sm border-t-2 border-poliba-surface px-8 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end space-x-5">
          <div className="flex-1 relative">
            <div className="relative group">
              {/* Input container con gradiente sottile */}
              <div className="absolute inset-0 bg-gradient-to-r from-poliba-bg to-white rounded-2xl opacity-50 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                placeholder="Scrivi il tuo messaggio al ChatBot del Politecnico..."
                className="w-full resize-none input-poliba bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 pr-16 focus:outline-none disabled:bg-poliba-bg/50 disabled:cursor-not-allowed transition-all duration-300 shadow-poliba-soft focus:shadow-poliba-medium text-poliba-dark placeholder:text-poliba-secondary relative z-10"
                rows={1}
                style={{
                  minHeight: '56px',
                  maxHeight: '160px',
                  overflow: 'hidden',
                }}
                disabled={disabled}
              />
              
              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={!message.trim() || disabled}
                className={`absolute right-3 bottom-3 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 transform relative overflow-hidden z-20 ${
                  !message.trim() || disabled
                    ? 'bg-poliba-surface text-poliba-secondary cursor-not-allowed scale-95 shadow-poliba-soft'
                    : 'btn-poliba text-white hover:scale-105 active:scale-95 shadow-poliba-medium hover:shadow-poliba-hard'
                }`}
              >
                {disabled ? (
                  <div className="w-5 h-5 border-2 border-poliba-secondary border-t-transparent rounded-full spinner-poliba"></div>
                ) : (
                  <svg 
                    className="w-6 h-6 transition-transform group-hover:rotate-12" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2.5} 
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Quick actions */}
          <div className="flex space-x-3">
            {/* Attachment button */}
            <button className="w-14 h-14 bg-poliba-bg hover:bg-poliba-surface rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-poliba-soft hover:shadow-poliba-medium group border border-poliba-light">
              <svg 
                className="w-6 h-6 text-poliba-primary group-hover:text-poliba-dark transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" 
                />
              </svg>
            </button>
            
            {/* Voice input button */}
            <button className="w-14 h-14 bg-poliba-bg hover:bg-poliba-surface rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-poliba-soft hover:shadow-poliba-medium group border border-poliba-light">
              <svg 
                className="w-6 h-6 text-poliba-primary group-hover:text-poliba-dark transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
                />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4 text-poliba-secondary">
            <span>Premi <kbd className="px-2 py-1 bg-poliba-surface rounded font-mono font-bold text-poliba-primary">Enter</kbd> per inviare</span>
            <span>•</span>
            <span><kbd className="px-2 py-1 bg-poliba-surface rounded font-mono font-bold text-poliba-primary">Shift + Enter</kbd> per andare a capo</span>
          </div>
          
          <div className="flex items-center space-x-2 text-poliba-secondary">
            <div className="w-2 h-2 bg-poliba-accent rounded-full pulse-poliba"></div>
            <span className="font-medium">Sicuro e privato</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputBox;
