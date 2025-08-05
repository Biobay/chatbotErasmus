# 🚀 Guida al Deployment - Chatbot Erasmus

## Panoramica

Questo chatbot Erasmus+ è pronto per il deployment su Railway.app con supporto per modifiche continue e aggiornamenti in tempo reale.

## 📋 Prerequisiti

- Account GitHub (✅ completato)
- Account Railway.app (da creare se necessario)
- Repository GitHub pulito (✅ completato)

## 🔧 Configurazione Railway

### 1. Creazione Account Railway
1. Vai su [railway.app](https://railway.app)
2. Registrati con il tuo account GitHub
3. Conferma la tua email

### 2. Collegamento Repository
1. Nella dashboard Railway, clicca "New Project"
2. Seleziona "Deploy from GitHub repo"
3. Scegli il repository `Biobay/chatbotErasmus`
4. Railway rileverà automaticamente i Dockerfile

### 3. Configurazione Environment Variables

Railway ha bisogno delle seguenti variabili d'ambiente:

```bash
# API Keys (OBBLIGATORIE)
GOOGLE_API_KEY=your_gemini_api_key_here

# Configurazione Backend
PORT=8000
ENVIRONMENT=production

# Configurazione Frontend
VITE_API_URL=https://your-app-name.railway.app
```

**Come aggiungere le variabili:**
1. Vai al tuo progetto Railway
2. Clicca sulla scheda "Variables"
3. Aggiungi ogni variabile con il pulsante "Add Variable"

### 4. Configurazione Dominio
Railway fornirà automaticamente un dominio come `your-app-name.railway.app`. Puoi:
- Usare il dominio gratuito fornito
- Collegare un dominio personalizzato (opzionale)

## 🏗️ Processo di Deployment

### Deploy Automatico
Railway eseguirà automaticamente:
1. **Backend**: Costruzione del container Docker dalla `Dockerfile.backend`
2. **Frontend**: Costruzione del container Docker dalla `Dockerfile.frontend`
3. **Networking**: Configurazione automatica del reverse proxy

### Monitoring del Deploy
1. Vai alla dashboard del progetto
2. Monitora i log in tempo reale
3. Verifica che entrambi i servizi siano "Active"

## 🔄 Workflow di Sviluppo Continuo

### Per Modifiche al Codice
```bash
# 1. Modifica i file localmente
# 2. Commit delle modifiche
git add .
git commit -m "Descrizione delle modifiche"
git push origin main

# 3. Railway farà automaticamente il redeploy
```

### Per Aggiungere Nuovi Documenti
```bash
# 1. Aggiungi i nuovi .md files nella cartella backend/documents/
# 2. Il sistema ricostruirà automaticamente il vector store al prossimo avvio
git add backend/documents/
git commit -m "Aggiunti nuovi documenti Erasmus"
git push origin main
```

### Per Aggiornare le Dipendenze
```bash
# Python (Backend)
pip install new_package
pip freeze > backend/requirements.txt

# Node.js (Frontend)
npm install new_package
npm update

# Commit e push
git add .
git commit -m "Aggiornate dipendenze"
git push origin main
```

## 🏗️ Architettura di Deployment

```
┌─────────────────────────────────────────┐
│              Railway.app                │
├─────────────────────────────────────────┤
│  Frontend Container (Port 5173)        │
│  ├─ Vite + React                       │
│  ├─ TailwindCSS                        │
│  └─ Ottimizzato per produzione         │
├─────────────────────────────────────────┤
│  Backend Container (Port 8000)         │
│  ├─ FastAPI + Uvicorn                  │
│  ├─ FAISS Vector Store                 │
│  ├─ Google Gemini AI                   │
│  └─ Health Check Endpoint              │
├─────────────────────────────────────────┤
│  Automatic Reverse Proxy               │
│  ├─ CORS Configuration                 │
│  ├─ Static File Serving                │
│  └─ API Routing                        │
└─────────────────────────────────────────┘
```

## 🔍 Monitoraggio e Debugging

### Health Checks
- **Backend**: `https://your-app.railway.app/health`
- **Frontend**: Caricamento della pagina principale

### Log Access
```bash
# Visualizza i log in tempo reale dalla dashboard Railway
# Oppure usa Railway CLI
railway logs
```

### Debugging Comune
1. **503 Service Unavailable**: Verifica le variabili d'ambiente
2. **CORS Errors**: Controlla `VITE_API_URL` nel frontend
3. **AI Responses Error**: Verifica `GOOGLE_API_KEY`

## 📈 Ottimizzazioni Produzione

### Performance
- ✅ Chunking intelligente dei documenti (6 file ottimizzati)
- ✅ FAISS IndexFlatIP per ricerca vettoriale veloce
- ✅ Frontend build ottimizzato con Vite
- ✅ Compressione automatica delle risposte

### Sicurezza
- ✅ CORS configurato correttamente
- ✅ Variabili d'ambiente per API keys
- ✅ Validazione input sui endpoint
- ✅ Rate limiting incorporato

### Scalabilità
- ✅ Container Docker per deployment isolato
- ✅ Health checks per auto-recovery
- ✅ Stateless design per scalabilità orizzontale

## 🚀 Go Live!

### Passi Finali
1. **Verifica Deployment**:
   ```bash
   curl https://your-app.railway.app/health
   ```

2. **Test Completo**:
   - Carica la pagina principale
   - Testa una domanda sul chatbot
   - Verifica la formattazione delle risposte

3. **Condividi il Link**:
   - URL finale: `https://your-app-name.railway.app`
   - Pronto per l'uso da parte degli studenti

## 💡 Consigli per Manutenzione

### Aggiornamenti Regolari
- Controlla i log settimanalmente
- Aggiorna i documenti quando necessario
- Monitora l'utilizzo delle API

### Backup
- I documenti sono nel repository GitHub (backup automatico)
- Il vector store si ricostruisce automaticamente
- Configurazione in `railway.toml` e Dockerfile

## 🆘 Supporto

In caso di problemi:
1. Controlla i log di Railway
2. Verifica le variabili d'ambiente
3. Testa gli endpoint manualmente
4. Controlla lo status di GitHub/Railway

---

**Stato Attuale**: ✅ Repository pulito, pronto per deployment!
**Prossimo Passo**: Creare account Railway e seguire la configurazione sopra
