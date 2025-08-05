# 🎓 ChatBot Erasmus - Politecnico di Bari

Un assistente virtuale professionale per navigare il mondo Erasmus+ del Politecnico di Bari.

## 🚀 Deploy Online

### Frontend (Vercel)
1. Vai su [vercel.com](https://vercel.com)
2. Importa questo repository
3. Seleziona la cartella `frontend-dev` come root directory
4. Deploy automatico

### Backend (Railway)
1. Vai su [railway.app](https://railway.app)
2. Importa questo repository
3. Configura le variabili d'ambiente:
   - `GEMINI_API_KEY`: La tua chiave API Gemini
4. Deploy automatico

### Alternativa Backend (Render)
1. Vai su [render.com](https://render.com)
2. Crea un nuovo Web Service
3. Connetti questo repository
4. Usa il comando: `python run.py`

## 🔧 Configurazione

### Variabili d'Ambiente Necessarie
```env
GEMINI_API_KEY=la_tua_chiave_api_qui
```

### Struttura del Progetto
```
chatbotErasmus/
├── frontend-dev/          # Frontend React + Vite
│   ├── src/
│   ├── public/
│   └── package.json
├── app/                   # Backend FastAPI
│   ├── main.py
│   ├── services/
│   └── __init__.py
├── documents/             # Documenti Erasmus
├── run.py                 # Server runner
└── requirements.txt       # Dipendenze Python
```

## 📱 Utilizzo
Una volta deployato, il chatbot sarà accessibile via web e fornirà informazioni su:
- Programmi Erasmus+
- Procedure di candidatura  
- Finanziamenti disponibili
- Partner universitari

## 🛠️ Sviluppo Locale

### Frontend
```bash
cd frontend-dev
npm install
npm run dev
```

### Backend  
```bash
pip install -r requirements.txt
python run.py
```

---
Sviluppato per il Politecnico di Bari 🏛️
