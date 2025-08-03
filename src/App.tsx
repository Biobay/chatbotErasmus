import { useChat } from './hooks/useChat';

function App() {
  const chatApi = useChat();

  return (
    <div className="h-screen bg-gradient-to-b from-green-50 to-teal-50 flex flex-col">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-green-700 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold">P</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-800 to-teal-700 bg-clip-text text-transparent">
              ChatBot Erasmus
            </h1>
            <p className="text-green-600 text-sm font-medium">Politecnico di Bari</p>
          </div>
        </div>
        <button
          onClick={chatApi.clearChat}
          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-xl transition-all duration-200"
          title="Nuova conversazione"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 bg-gradient-to-b from-white to-green-50 overflow-hidden">
        <div className="h-full overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {chatApi.messages.length <= 1 && (
              <div className="text-center mb-12">
                {/* Logo del Politecnico */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-green-100">
                      <img 
                        src="/logo.jpg" 
                        alt="Politecnico di Bari"
                        className="w-20 h-20 object-contain rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<div class="w-20 h-20 bg-gradient-to-br from-green-700 to-teal-600 rounded-full flex items-center justify-center"><span class="text-white font-bold text-2xl">PoliBA</span></div>';
                        }}
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 mb-12">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-green-800 via-green-700 to-teal-600 bg-clip-text text-transparent">
                    ChatBot Erasmus
                  </h1>
                  <h2 className="text-2xl font-semibold text-green-700">
                    Politecnico di Bari
                  </h2>
                  <p className="text-green-600 text-lg max-w-2xl mx-auto leading-relaxed">
                    Il tuo assistente virtuale per navigare il mondo Erasmus. 
                    Ricevi informazioni aggiornate su programmi di scambio, 
                    procedure di candidatura e opportunità internazionali.
                  </p>
                </div>

                {/* Cards informative */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  {[
                    { icon: "🎓", title: "Programmi Erasmus", description: "Scopri destinazioni e requisiti" },
                    { icon: "📋", title: "Candidature", description: "Guida alle procedure" },
                    { icon: "💰", title: "Finanziamenti", description: "Borse e contributi" },
                    { icon: "🏛️", title: "Università", description: "Partner internazionali" }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="bg-white/90 backdrop-blur-sm border border-green-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                    >
                      <div className="text-center space-y-3">
                        <div className="text-4xl group-hover:animate-bounce">{item.icon}</div>
                        <h4 className="font-semibold text-green-800 group-hover:text-teal-700 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-green-600 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Suggerimenti */}
                <div className="bg-white/80 backdrop-blur-sm border border-green-100 rounded-3xl p-8">
                  <h3 className="text-green-800 font-semibold mb-6 text-xl">
                    💡 Inizia con una di queste domande:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    {[
                      "Quali sono i programmi Erasmus disponibili?",
                      "Come posso candidarmi per uno scambio?",
                      "Che documenti devo preparare?",
                      "Quando escono i bandi?"
                    ].map((suggestion, index) => (
                      <div 
                        key={index}
                        className="bg-green-50/50 hover:bg-white border border-green-100 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-teal-500 rounded-full group-hover:animate-pulse"></div>
                          <p className="text-green-700 group-hover:text-teal-700 transition-colors font-medium">
                            {suggestion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {chatApi.messages.map((message) => (
                <div key={message.id} className={`p-4 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-green-100 to-teal-100 ml-8 border border-green-200' 
                    : 'bg-white mr-8 border border-green-100 shadow-sm'
                }`}>
                  <p className="text-green-800">{message.content}</p>
                </div>
              ))}
              
              {chatApi.isTyping && (
                <div className="bg-white mr-8 p-4 rounded-lg border border-green-100 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <span className="text-green-600 ml-2">Il bot sta scrivendo...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white/95 backdrop-blur-sm border-t border-green-200 p-6">
        <div className="max-w-4xl mx-auto flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Scrivi il tuo messaggio al ChatBot del Politecnico..."
              className="w-full border-2 border-green-200 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const target = e.target as HTMLInputElement;
                  if (target.value.trim()) {
                    chatApi.sendMessage(target.value.trim());
                    target.value = '';
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
                }
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 flex items-center justify-center transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center space-x-8 text-green-600 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
            <span>Assistenza 24/7</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Sicuro e privato</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
