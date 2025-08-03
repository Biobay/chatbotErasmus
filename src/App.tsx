import { useChat } from './hooks/useChat';
import { ThemeToggle } from './components/ThemeToggle';
import { useToast } from './components/Toast';

function App() {
  const chatApi = useChat();
  const { addToast, ToastProvider } = useToast();

  return (
    <div className="h-screen bg-gradient-to-br from-poliba-bg via-white to-poliba-surface dark:from-poliba-dark-bg dark:via-poliba-dark-surface dark:to-poliba-dark-bg flex flex-col transition-all duration-300">
      {/* Header professionale con logo */}
      <div className="bg-gradient-header dark:bg-gradient-header-dark border-b border-poliba-light/20 dark:border-poliba-dark-light/20 px-6 py-4 flex items-center justify-between shadow-poliba dark:shadow-poliba-xl backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          {/* Logo del Politecnico */}
          <div className="relative">
            <div className="w-12 h-12 bg-white dark:bg-poliba-dark-surface rounded-xl flex items-center justify-center shadow-poliba-lg dark:shadow-poliba-xl border-2 border-poliba-light/30 dark:border-poliba-dark-light/30">
              <img 
                src="/logo.jpg" 
                alt="Politecnico di Bari"
                className="w-10 h-10 object-contain rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const isDarkMode = document.documentElement.classList.contains('dark');
                  target.parentElement!.innerHTML = `<div class="w-10 h-10 ${isDarkMode ? 'bg-gradient-poliba-night' : 'bg-gradient-poliba'} rounded-lg flex items-center justify-center"><span class="text-white font-bold text-sm">PoliBA</span></div>`;
                }}
              />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-poliba-accent dark:bg-poliba-dark-primary rounded-full flex items-center justify-center animate-pulse-poliba">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          
          {/* Titoli */}
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white drop-shadow-lg font-inter">
              ChatBot Erasmus
            </h1>
            <p className="text-poliba-light dark:text-poliba-dark-light text-sm font-medium tracking-wide">
              Politecnico di Bari • AI Assistant
            </p>
          </div>
        </div>
        
        {/* Azioni header */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 text-poliba-light dark:text-poliba-dark-light text-sm">
            <div className="w-2 h-2 bg-poliba-accent dark:bg-poliba-dark-primary rounded-full animate-pulse"></div>
            <span>Online</span>
          </div>
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          <button
            onClick={() => {
              chatApi.clearChat();
              addToast('Nuova conversazione avviata', 'success');
            }}
            className="p-3 text-white/80 hover:text-white hover:bg-white/10 dark:hover:bg-poliba-dark-surface/30 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 dark:border-poliba-dark-light/20 hover:border-white/40 dark:hover:border-poliba-dark-light/40"
            title="Nuova conversazione"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Area chat principale */}
      <div className="flex-1 bg-gradient-to-b from-white via-poliba-bg/30 to-poliba-surface/50 dark:from-poliba-dark-surface dark:via-poliba-dark-bg/50 dark:to-poliba-dark-surface overflow-hidden transition-all duration-300">
        <div className="h-full overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {/* Schermata di benvenuto */}
            {chatApi.messages.length <= 1 && (
              <div className="text-center mb-12 animate-fade-in">
                {/* Logo centrale grande */}
                <div className="flex justify-center mb-10">
                  <div className="relative">
                    <div className="w-28 h-28 bg-white dark:bg-poliba-dark-surface rounded-full flex items-center justify-center shadow-poliba-xl dark:shadow-poliba-xl border-4 border-poliba-light/50 dark:border-poliba-dark-light/50 backdrop-blur-sm transition-all duration-300">
                      <img 
                        src="/logo.jpg" 
                        alt="Politecnico di Bari"
                        className="w-24 h-24 object-contain rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const isDarkMode = document.documentElement.classList.contains('dark');
                          target.parentElement!.innerHTML = `<div class="w-24 h-24 ${isDarkMode ? 'bg-gradient-poliba-night' : 'bg-gradient-poliba'} rounded-full flex items-center justify-center shadow-inner-poliba"><span class="text-white font-bold text-3xl font-inter">PoliBA</span></div>`;
                        }}
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-poliba-accent dark:bg-poliba-dark-primary rounded-full flex items-center justify-center animate-glow">
                      <div className="w-4 h-4 bg-white rounded-full animate-pulse-poliba"></div>
                    </div>
                  </div>
                </div>

                {/* Titoli principali */}
                <div className="space-y-6 mb-14">
                  <h1 className="text-6xl font-bold bg-gradient-poliba dark:bg-gradient-poliba-night bg-clip-text text-transparent font-inter tracking-tight transition-all duration-300">
                    ChatBot Erasmus
                  </h1>
                  <h2 className="text-3xl font-semibold text-poliba-primary dark:text-poliba-dark-primary font-segoe transition-colors duration-300">
                    Politecnico di Bari
                  </h2>
                  <div className="max-w-3xl mx-auto">
                    <p className="text-poliba-dark dark:text-poliba-dark-dark text-xl leading-relaxed font-inter transition-colors duration-300">
                      Il tuo assistente virtuale professionale per navigare il mondo Erasmus+ 
                    </p>
                    <p className="text-text-secondary dark:text-gray-400 text-lg mt-2 transition-colors duration-300">
                      Ricevi informazioni aggiornate su programmi di scambio, procedure di candidatura e opportunità internazionali
                    </p>
                  </div>
                </div>

                {/* Cards informative professionali */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                  {[
                    { 
                      icon: "🎓", 
                      title: "Programmi Erasmus+", 
                      description: "Esplora destinazioni universitarie e requisiti di accesso",
                      color: "from-poliba-primary to-poliba-accent dark:from-poliba-dark-primary dark:to-poliba-dark-accent"
                    },
                    { 
                      icon: "📋", 
                      title: "Procedure di Candidatura", 
                      description: "Guida passo-passo per le iscrizioni e documentazione",
                      color: "from-poliba-accent to-poliba-secondary dark:from-poliba-dark-accent dark:to-poliba-dark-secondary"
                    },
                    { 
                      icon: "💰", 
                      title: "Finanziamenti", 
                      description: "Borse di studio, contributi e supporto economico",
                      color: "from-poliba-secondary to-poliba-light dark:from-poliba-dark-secondary dark:to-poliba-dark-light"
                    },
                    { 
                      icon: "🏛️", 
                      title: "Partner Universitari", 
                      description: "Rete di università convenzionate a livello europeo",
                      color: "from-poliba-light to-poliba-primary dark:from-poliba-dark-light dark:to-poliba-dark-primary"
                    }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="group bg-white/95 dark:bg-poliba-dark-surface/95 backdrop-blur-md border border-poliba-light/30 dark:border-poliba-dark-light/30 rounded-3xl p-8 hover:shadow-poliba-lg dark:hover:shadow-poliba-xl transition-all duration-500 hover:scale-105 cursor-pointer animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="text-center space-y-4">
                        <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-3xl group-hover:animate-bounce shadow-poliba transition-all duration-300`}>
                          {item.icon}
                        </div>
                        <h4 className="font-bold text-poliba-primary dark:text-poliba-dark-primary group-hover:text-poliba-accent dark:group-hover:text-poliba-dark-accent transition-colors text-lg font-inter">
                          {item.title}
                        </h4>
                        <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed font-segoe transition-colors duration-300">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Suggerimenti professionali */}
                <div className="bg-white/90 dark:bg-poliba-dark-surface/90 backdrop-blur-md border border-poliba-light/50 dark:border-poliba-dark-light/50 rounded-3xl p-10 shadow-poliba dark:shadow-poliba-xl transition-all duration-300">
                  <div className="flex items-center justify-center mb-8">
                    <div className="w-12 h-12 bg-gradient-poliba dark:bg-gradient-poliba-night rounded-2xl flex items-center justify-center transition-all duration-300">
                      <span className="text-white text-2xl">💡</span>
                    </div>
                    <h3 className="text-poliba-primary dark:text-poliba-dark-primary font-bold ml-4 text-2xl font-inter transition-colors duration-300">
                      Inizia la tua esperienza Erasmus
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {[
                      "Quali sono i programmi Erasmus+ disponibili per il mio corso?",
                      "Come posso candidarmi per uno scambio universitario?",
                      "Che documenti devo preparare per la candidatura?",
                      "Quando escono i bandi per il prossimo anno accademico?"
                    ].map((suggestion, index) => (
                      <div 
                        key={index}
                        className="bg-gradient-to-r from-poliba-bg to-white dark:from-poliba-dark-bg dark:to-poliba-dark-surface hover:from-white hover:to-poliba-bg dark:hover:from-poliba-dark-surface dark:hover:to-poliba-dark-bg border border-poliba-light/30 dark:border-poliba-dark-light/30 rounded-2xl p-6 hover:shadow-poliba dark:hover:shadow-poliba-lg transition-all duration-300 cursor-pointer group"
                        onClick={() => {
                          const input = document.querySelector('input') as HTMLInputElement;
                          if (input) {
                            input.value = suggestion;
                            input.focus();
                          }
                        }}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-3 h-3 bg-poliba-accent dark:bg-poliba-dark-primary rounded-full mt-2 group-hover:animate-pulse-poliba flex-shrink-0 transition-colors duration-300"></div>
                          <p className="text-poliba-dark dark:text-poliba-dark-dark group-hover:text-poliba-primary dark:group-hover:text-poliba-dark-primary transition-colors font-medium leading-relaxed font-segoe">
                            {suggestion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Area messaggi */}
            <div className="space-y-6">
              {chatApi.messages.map((message) => (
                <div key={message.id} className={`animate-fade-in ${
                  message.role === 'user' 
                    ? 'flex justify-end' 
                    : 'flex justify-start'
                }`}>
                  <div className={`max-w-4xl px-6 py-4 rounded-3xl shadow-poliba dark:shadow-poliba-lg transition-all duration-300 ${
                    message.role === 'user' 
                      ? 'bg-gradient-user dark:bg-gradient-user-dark text-white ml-12 border border-poliba-primary/20 dark:border-poliba-dark-primary/20' 
                      : 'bg-gradient-bot dark:bg-gradient-bot-dark text-poliba-dark dark:text-poliba-dark-dark mr-12 border border-poliba-light/50 dark:border-poliba-dark-light/50'
                  }`}>
                    <p className="leading-relaxed font-segoe">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {chatApi.isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white dark:bg-poliba-dark-surface mr-12 px-6 py-4 rounded-3xl border border-poliba-light/50 dark:border-poliba-dark-light/50 shadow-poliba dark:shadow-poliba-lg transition-all duration-300">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-poliba-accent dark:bg-poliba-dark-primary rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-poliba-accent dark:bg-poliba-dark-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-3 h-3 bg-poliba-accent dark:bg-poliba-dark-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <span className="text-poliba-primary dark:text-poliba-dark-primary ml-3 font-medium font-segoe transition-colors duration-300">Il ChatBot sta elaborando la risposta...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Input area professionale */}
      <div className="bg-white/95 dark:bg-poliba-dark-surface/95 backdrop-blur-md border-t border-poliba-light/30 dark:border-poliba-dark-light/30 p-8 shadow-poliba-lg dark:shadow-poliba-xl transition-all duration-300">
        <div className="max-w-5xl mx-auto">
          <div className="flex space-x-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Scrivi il tuo messaggio al ChatBot del Politecnico di Bari..."
                className="w-full border-2 border-poliba-light/50 dark:border-poliba-dark-light/50 rounded-3xl px-8 py-5 pr-20 focus:outline-none focus:ring-4 focus:ring-poliba-primary/20 dark:focus:ring-poliba-dark-primary/20 focus:border-poliba-primary dark:focus:border-poliba-dark-primary transition-all duration-300 bg-white/90 dark:bg-poliba-dark-bg/90 backdrop-blur-sm text-poliba-dark dark:text-poliba-dark-dark placeholder-text-secondary dark:placeholder-gray-400 font-segoe text-lg shadow-inner-poliba"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim()) {
                      chatApi.sendMessage(target.value.trim());
                      target.value = '';
                      addToast('Messaggio inviato', 'success', 2000);
                    }
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector('input') as HTMLInputElement;
                  if (input.value.trim()) {
                    chatApi.sendMessage(input.value.trim());
                    input.value = '';
                    addToast('Messaggio inviato', 'success', 2000);
                  }
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-poliba dark:bg-gradient-poliba-night text-white rounded-2xl hover:bg-gradient-poliba-dark dark:hover:bg-gradient-poliba-dark flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-poliba dark:shadow-poliba-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>

          {/* Footer informativo */}
          <div className="mt-6 flex items-center justify-center space-x-12 text-text-secondary dark:text-gray-400 text-sm font-segoe transition-colors duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-poliba-accent dark:bg-poliba-dark-primary rounded-full animate-pulse-poliba"></div>
              <span>Assistenza AI 24/7</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-4 h-4 text-poliba-primary dark:text-poliba-dark-primary transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Dati sicuri e privati</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-4 h-4 text-poliba-primary dark:text-poliba-dark-primary transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Informazioni ufficiali PoliBA</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Provider */}
      <ToastProvider />
    </div>
  );
}

export default App;
