import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="mb-8 flex justify-start message-bot">
      <div className="max-w-[80%] md:max-w-[70%]">
        <div className="flex items-end space-x-4 mb-2">
          <div className="relative flex-shrink-0 group">
            <div className="w-12 h-12 bg-gradient-poliba rounded-2xl flex items-center justify-center shadow-poliba-medium border-2 border-white">
              {/* Logo PoliBA animato */}
              <svg 
                className="w-6 h-6 text-white animate-pulse" 
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
            {/* Badge animato */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-poliba-accent rounded-full border-2 border-white flex items-center justify-center pulse-poliba">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl rounded-bl-md px-6 py-4 shadow-poliba-medium border border-poliba-surface bubble-tail-left relative overflow-hidden">
            {/* Background gradient animato */}
            <div className="absolute inset-0 bg-gradient-to-r from-poliba-bg/50 to-transparent opacity-50"></div>
            
            <div className="flex items-center space-x-4 relative z-10">
              <div className="flex space-x-2">
                <div className="w-2.5 h-2.5 bg-poliba-primary rounded-full typing-dot"></div>
                <div className="w-2.5 h-2.5 bg-poliba-secondary rounded-full typing-dot"></div>
                <div className="w-2.5 h-2.5 bg-poliba-accent rounded-full typing-dot"></div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-poliba-primary">ChatBot sta scrivendo</span>
                <span className="text-xs text-poliba-secondary">Elaborazione in corso...</span>
              </div>
            </div>
            
            {/* Effetto shimmer */}
            <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
