# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# ChatBot Erasmus

Un'applicazione frontend moderna in React che simula una chat in stile ChatGPT con interfaccia elegante e professionale.

## 🚀 Caratteristiche

- **Interfaccia moderna**: Design pulito e minimale ispirato a ChatGPT
- **Responsive**: Ottimizzata per desktop e mobile
- **Animazioni fluide**: Transizioni leggere e feedback visivi
- **Scrollbar personalizzata**: Elemento UI elegante e discreto
- **Auto-scroll**: La chat scorre automaticamente ai nuovi messaggi
- **Typing indicator**: Indicatore di digitazione durante la risposta del bot
- **Mock responses**: Risposte simulate con delay realistico (1.5-2.5s)

## 🛠️ Stack Tecnologico

- **React 19** con TypeScript
- **Vite** per il build tool
- **Tailwind CSS** per lo styling
- **Font Inter** da Google Fonts
- **ESLint** per il linting

## 📦 Installazione

```bash
# Clona il repository
git clone [url-repository]
cd chatbotErasmus

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Build per produzione
npm run build
```

## 🎨 Struttura dei Componenti

```
src/
├── components/
│   ├── Header.tsx          # Header con logo e status
│   ├── ChatWindow.tsx      # Componente principale della chat
│   ├── Message.tsx         # Singolo messaggio utente/bot
│   ├── TypingIndicator.tsx # Indicatore di digitazione
│   └── InputBox.tsx        # Area di input per i messaggi
├── types/
│   └── chat.ts            # Tipi TypeScript per i messaggi
└── App.tsx                # Componente principale
```

## 🎯 Funzionalità Implementate

### Interfaccia Utente
- Design pulito con sfondo bianco
- Messaggi in stile "chat bubble" con angoli arrotondati
- Distinzione visiva tra messaggi utente (blu) e bot (grigio)
- Avatar per utente e bot
- Timestamp per ogni messaggio

### Interazione
- Input con supporto per invio tramite Enter
- Shift + Enter per andare a capo
- Disabilitazione dell'input durante la risposta del bot
- Auto-resize della textarea

### Esperienza Utente
- Animazioni fade-in per i nuovi messaggi
- Indicatore di typing con pallini animati
- Auto-scroll ai nuovi messaggi
- Stato online visibile nell'header

## 🔧 Personalizzazione

### Modificare le Risposte Mock
Modifica l'array `MOCK_RESPONSES` in `ChatWindow.tsx`:

```typescript
const MOCK_RESPONSES = [
  "La tua risposta personalizzata...",
  // Aggiungi altre risposte
];
```

### Cambiare i Colori
Modifica le classi Tailwind nei componenti o estendi il tema in `tailwind.config.js`.

### Integrare con API Reale
Sostituisci la logica mock in `handleSendMessage` con chiamate API reali:

```typescript
const handleSendMessage = async (content: string) => {
  // Aggiungi messaggio utente
  const userMessage = { /* ... */ };
  
  // Chiamata API
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message: content })
  });
  
  const botResponse = await response.json();
  // Aggiungi risposta bot
};
```

## 📱 Responsive Design

L'applicazione è completamente responsive:
- **Desktop**: Layout a larghezza massima con margini
- **Tablet**: Adattamento delle dimensioni dei messaggi
- **Mobile**: Ottimizzazione per schermi piccoli

## 🚀 Deploy

```bash
# Build per produzione
npm run build

# Preview del build
npm run preview
```

I file di build saranno generati nella cartella `dist/`.

## 📄 Licenza

Progetto di esempio per scopi educativi.

---

**Nota**: Questa è un'implementazione frontend-only con risposte simulate. Per un chatbot funzionale, integra con un'API backend o servizi come OpenAI API.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
