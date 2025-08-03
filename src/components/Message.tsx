import React from 'react';
import type { Message as MessageType } from '../types/chat';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className={`mb-8 ${isUser ? 'flex justify-end' : 'flex justify-start'} ${isUser ? 'message-user' : 'message-bot'}`}>
      <div className={`max-w-[80%] md:max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div className={`flex items-end space-x-4 mb-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          {!isUser && (
            <div className="relative flex-shrink-0 group">
              <div className="w-12 h-12 bg-gradient-poliba rounded-2xl flex items-center justify-center shadow-poliba-medium group-hover:shadow-poliba-hard transition-all duration-300 border-2 border-white">
                {/* Logo PoliBA per il bot */}
                <svg 
                  className="w-6 h-6 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2.5} 
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                  />
                </svg>
              </div>
              {/* Badge PoliBA */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-poliba-accent rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
          )}
          
          <div className={`relative max-w-full group ${
            isUser 
              ? 'bg-gradient-user text-white rounded-2xl rounded-br-md bubble-tail-right shadow-poliba-medium hover:shadow-poliba-hard' 
              : 'bg-white text-poliba-dark rounded-2xl rounded-bl-md bubble-tail-left shadow-poliba-medium hover:shadow-poliba-hard border border-poliba-surface'
          } px-6 py-4 transition-all duration-300`}>
            
            {/* Message content */}
            <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
              {message.content}
            </p>
            
            {/* Timestamp e status */}
            <div className={`flex justify-between items-center mt-3 pt-2 border-t ${
              isUser ? 'border-poliba-light/30' : 'border-poliba-surface'
            }`}>
              <span className={`text-xs font-medium ${
                isUser ? 'text-poliba-light' : 'text-poliba-secondary'
              }`}>
                {formatTime(message.timestamp)}
              </span>
              
              {isUser && (
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3 text-poliba-light" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <svg className="w-3 h-3 text-poliba-light" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          
          {isUser && (
            <div className="relative flex-shrink-0 group">
              <div className="w-12 h-12 bg-gradient-to-br from-poliba-secondary to-poliba-primary rounded-2xl flex items-center justify-center shadow-poliba-medium group-hover:shadow-poliba-hard transition-all duration-300 border-2 border-white">
                {/* User icon */}
                <svg 
                  className="w-6 h-6 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              {/* Status indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-poliba-accent rounded-full border-2 border-white"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
