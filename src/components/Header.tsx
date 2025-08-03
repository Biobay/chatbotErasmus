import React from 'react';

interface HeaderProps {
  onClearChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClearChat }) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-poliba-surface/30 px-6 py-3 flex items-center justify-between relative z-20 shrink-0">
      <div className="flex items-center space-x-4">
        {/* Logo PoliBA */}
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-poliba-medium relative overflow-hidden group border-2 border-poliba-primary/20">
          <img 
            src="/logo.jpg" 
            alt="Politecnico di Bari"
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              // Fallback se l'immagine non è trovata
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `
                <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-poliba-primary to-poliba-accent rounded-lg">
                  <span class="text-white font-bold text-sm">P</span>
                </div>
              `;
            }}
          />
          <div className="absolute inset-0 shine-poliba"></div>
        </div>
        
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-poliba-dark to-poliba-primary bg-clip-text text-transparent">
            ChatBot Erasmus
          </h1>
          <p className="text-poliba-secondary text-sm">Politecnico di Bari</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Status indicator */}
        <div className="flex items-center space-x-2 text-poliba-secondary text-sm">
          <div className="w-2 h-2 bg-poliba-accent rounded-full pulse-poliba"></div>
          <span className="hidden sm:inline">Online</span>
        </div>

        {/* Clear chat button */}
        <button
          onClick={onClearChat}
          className="p-2 text-poliba-secondary hover:text-poliba-primary hover:bg-poliba-bg rounded-xl transition-all duration-200 group"
          title="Nuova conversazione"
        >
          <svg className="w-5 h-5 transform group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
