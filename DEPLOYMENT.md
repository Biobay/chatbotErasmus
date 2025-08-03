# Deployment Instructions

## Opzioni di Deploy

### 1. Netlify (Consigliato)

1. Vai su [netlify.com](https://www.netlify.com)
2. Collega il tuo repository GitHub
3. Configura:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy automatico ad ogni push

### 2. Vercel

1. Vai su [vercel.com](https://vercel.com)
2. Importa il progetto da GitHub
3. Vercel rileverà automaticamente che è un progetto Vite
4. Deploy automatico

### 3. GitHub Pages

1. Installa `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Aggiungi al `package.json`:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://tuousername.github.io/chatbotErasmus"
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

### 4. Deploy Manuale

1. Build del progetto:
   ```bash
   npm run build
   ```

2. Carica la cartella `dist/` su qualsiasi hosting statico:
   - Apache
   - Nginx
   - Cloudflare Pages
   - AWS S3 + CloudFront
   - Firebase Hosting

### 5. Docker (Opzionale)

Crea un `Dockerfile`:

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build e run:
```bash
docker build -t chatbot-erasmus .
docker run -p 80:80 chatbot-erasmus
```

## Configurazioni Speciali

### Base URL
Se deployi in una sottocartella, modifica `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/tua-sottocartella/',
  // ...
})
```

### Variabili d'ambiente
Crea `.env.production` per variabili di produzione:

```
VITE_API_URL=https://api.tuodominio.com
```

## Note
- L'applicazione è completamente statica (solo frontend)
- Non richiede server Node.js in produzione
- Tutti i file necessari sono nella cartella `dist/`
