# 🤖 Erasmus ChatBot Backend

Backend API per il ChatBot Erasmus del Politecnico di Bari con sistema RAG (Retrieval-Augmented Generation).

## 🚀 Caratteristiche

- **Multi-LLM Support**: Gemini, OpenAI GPT, Claude Anthropic
- **RAG System**: Ricerca semantica su documenti
- **Vector Database**: FAISS per ricerca veloce
- **Document Processing**: Supporto .md, .txt, .pdf
- **Session Management**: Gestione conversazioni utente
- **CORS Ready**: Integrazione con frontend React

## 📋 Prerequisiti

- Python 3.8+
- Almeno una API key per:
  - Google Gemini AI
  - OpenAI GPT
  - Anthropic Claude

## 🛠️ Installazione

### 1. Clona e Installa Dipendenze

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configura Variabili d'Ambiente

Copia `.env` e aggiungi le tue API keys:

```bash
cp .env .env.local
```

Modifica `.env.local`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key
OPENAI_API_KEY=your_actual_openai_api_key
ANTHROPIC_API_KEY=your_actual_anthropic_api_key
```

### 3. Avvia il Server

```bash
python run.py
```

Il server sarà disponibile su: `http://localhost:8000`

## 📡 API Endpoints

### Chat
```http
POST /chat
Content-Type: application/json

{
  "message": "Quali sono i requisiti per l'Erasmus?",
  "session_id": "optional-uuid",
  "use_rag": true
}
```

### Upload Documenti
```http
POST /upload
Content-Type: multipart/form-data

file: documento.md
```

### Statistiche Knowledge Base
```http
GET /knowledge-base/stats
```

### Documentazione API
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 📁 Struttura Progetto

```
backend/
├── app/
│   ├── main.py              # FastAPI app principale
│   ├── services/
│   │   ├── llm_service.py   # Gestione LLM API
│   │   ├── chat_service.py  # Logica conversazione
│   │   ├── document_processor.py # Processing documenti
│   │   └── vector_store.py  # Vector database
├── documents/               # Knowledge base files
├── vector_db/              # FAISS index (auto-generato)
├── requirements.txt
├── .env
└── run.py
```

## 🧠 Sistema RAG

### 1. Document Processing
- **Chunking intelligente**: Divide documenti in sezioni semantiche
- **Embeddings**: Usa SentenceTransformers per vettorializzazione
- **Metadati**: Traccia fonte, tipo file, tokens

### 2. Vector Search  
- **FAISS**: Database vettoriale veloce e scalabile
- **Similarità coseno**: Ricerca semantica accurata
- **Threshold**: Filtro per rilevanza minima

### 3. LLM Integration
- **Context injection**: Inserisce documenti rilevanti nel prompt
- **Multi-provider**: Fallback automatico tra API
- **Response enhancement**: Migliora risposte con conoscenza specifica

## 🔧 Configurazione LLM

### Google Gemini (Consigliato)
```python
# Ottieni API key da: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_key_here
```

### OpenAI GPT
```python  
# Ottieni API key da: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_key_here
```

### Anthropic Claude
```python
# Ottieni API key da: https://console.anthropic.com/
ANTHROPIC_API_KEY=your_key_here
```

## 📊 Monitoraggio

### Logs
```bash
# Guarda logs in tempo reale
tail -f logs/chatbot.log
```

### Metriche
- Numero documenti indicizzati
- Sessioni attive
- Utilizzo token per provider
- Performance ricerca vettoriale

## 🧪 Testing

### Test API
```bash
# Test endpoint base
curl http://localhost:8000/

# Test chat
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Ciao, come funziona Erasmus?"}'
```

### Test Upload
```bash
curl -X POST http://localhost:8000/upload \
  -F "file=@documents/erasmus_guide.md"
```

## 🚀 Deployment

### Docker (Opzionale)
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "run.py"]
```

### Variabili Produzione
```env
DEBUG=False
HOST=0.0.0.0
PORT=8000
FRONTEND_URL=https://your-frontend-domain.com
```

## 📚 Aggiungere Documenti

### Formato Supportati
- **Markdown (.md)**: Guide, FAQ, procedure
- **Text (.txt)**: Testi semplici
- **PDF (.pdf)**: Documenti ufficiali

### Best Practices
- **Nomi file descrittivi**: `erasmus_requirements.md`
- **Struttura clara**: Usa headers, paragrafi, liste
- **Contenuto specifico**: Informazioni Erasmus PoliBA
- **Aggiornamenti regolari**: Mantieni info correnti

### Esempi Documenti
```
documents/
├── erasmus_guide.md         # Guida generale
├── application_process.md   # Processo candidatura
├── destinations.md          # Università partner
├── financial_aid.md        # Borse e finanziamenti
└── faq.md                  # Domande frequenti
```

## 🔍 Debugging

### Common Issues

**1. Import Errors**
```bash
pip install --upgrade -r requirements.txt
```

**2. API Key Non Valida**
```bash
# Verifica .env.local
cat .env.local | grep API_KEY
```

**3. FAISS Installation**
```bash
# Su alcuni sistemi
pip install faiss-cpu --no-cache-dir
```

**4. CORS Errors**
```python
# Verifica FRONTEND_URL in .env
FRONTEND_URL=http://localhost:5175
```

## 📞 Supporto

Per problemi tecnici:
1. Controlla logs: `tail -f logs/chatbot.log`
2. Verifica configurazione: `/knowledge-base/stats`
3. Testa API: `http://localhost:8000/docs`

---

🎓 **Politecnico di Bari - Erasmus ChatBot** 🤖
