import React, { useEffect, useRef } from 'react';
import type { Message } from '../types/chat';
import MessageComponent from './Message';
import TypingIndicator from './TypingIndicator';
import InputBox from './InputBox';
import PoliBaLogo from './PoliBaLogo';

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  sendMessage: (content: string) => Promise<void>;
}

// Componente per la sezione di benvenuto separata
const WelcomeSection: React.FC = () => {
  return (
    <div className="text-center py-12 mb-8">
      {/* Logo del Politecnico di Bari */}
      <div className="flex justify-center mb-8">
        <PoliBaLogo size={120} />
      </div>
      
      {/* Titoli */}
      <div className="space-y-4 mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-poliba-dark via-poliba-primary to-poliba-accent bg-clip-text text-transparent">
          ChatBot Erasmus
        </h1>
        <h2 className="text-2xl font-semibold text-poliba-primary">
          Politecnico di Bari
        </h2>
        <p className="text-poliba-secondary text-lg max-w-2xl mx-auto leading-relaxed">
          Il tuo assistente virtuale per navigare il mondo Erasmus. 
          Ricevi informazioni aggiornate su programmi di scambio, 
          procedure di candidatura e opportunità internazionali.
        </p>
      </div>
    </div>
  );
};

// Componente per le cards informative separato
const InfoCardsSection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      <h3 className="text-2xl font-bold text-poliba-dark mb-8 text-center">
        💡 Come posso aiutarti oggi?
      </h3>
      
      {/* Cards principali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            icon: "🎓",
            title: "Programmi Erasmus",
            description: "Scopri destinazioni e requisiti",
            color: "from-blue-500 to-blue-600"
          },
          {
            icon: "📋",
            title: "Candidature", 
            description: "Guida alle procedure",
            color: "from-green-500 to-emerald-600"
          },
          {
            icon: "💰",
            title: "Finanziamenti",
            description: "Borse e contributi",
            color: "from-yellow-500 to-orange-600"
          },
          {
            icon: "🏛️",
            title: "Università",
            description: "Partner internazionali",
            color: "from-purple-500 to-indigo-600"
          }
        ].map((item, index) => (
          <div 
            key={index}
            className="bg-white/90 backdrop-blur-sm border border-poliba-light rounded-2xl p-6 hover:shadow-poliba-medium transition-all duration-300 hover:scale-105 cursor-pointer group"
          >
            <div className="text-center space-y-3">
              <div className="text-4xl group-hover:animate-bounce">{item.icon}</div>
              <h4 className="font-semibold text-poliba-dark group-hover:text-poliba-primary transition-colors">
                {item.title}
              </h4>
              <p className="text-poliba-secondary text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Suggerimenti di conversazione */}
      <div className="bg-white/80 backdrop-blur-sm border border-poliba-light rounded-3xl p-8">
        <h4 className="text-poliba-dark font-semibold mb-6 text-lg">
          � Domande frequenti:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {[
            "Quali sono i programmi Erasmus disponibili?",
            "Come posso candidarmi per uno scambio?",
            "Che documenti devo preparare?",
            "Quando escono i bandi?"
          ].map((suggestion, index) => (
            <div 
              key={index}
              className="bg-poliba-bg/50 hover:bg-white border border-poliba-surface rounded-xl p-4 hover:shadow-poliba-soft transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-poliba-accent rounded-full group-hover:animate-pulse"></div>
                <p className="text-poliba-secondary group-hover:text-poliba-primary transition-colors font-medium">
                  {suggestion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-8 pt-6 border-t border-poliba-light/50">
        <div className="flex items-center justify-center space-x-8 text-poliba-secondary">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-poliba-accent rounded-full pulse-poliba"></div>
            <span className="font-medium">Assistenza 24/7</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Sicuro e privato</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Sempre aggiornato</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, 
  isTyping, 
  sendMessage 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-poliba-bg/20 to-white/95 relative overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar-poliba px-6 py-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Mostra il benvenuto solo quando non ci sono messaggi o solo il messaggio di sistema */}
          {messages.length <= 1 && (
            <>
              <WelcomeSection />
              <InfoCardsSection />
            </>
          )}
          
          {messages.map((message) => (
            <MessageComponent key={message.id} message={message} />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <InputBox 
        onSendMessage={sendMessage} 
        disabled={isTyping}
      />
    </div>
  );
};

export default ChatWindow;
