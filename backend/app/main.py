from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from app.services.chat_service import ChatService
from app.services.document_processor import DocumentProcessor

load_dotenv()

# Inizializza i servizi globalmente
chat_service = ChatService()
document_processor = DocumentProcessor()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await chat_service.initialize()
    print("🚀 ChatBot API avviata con successo!")
    yield
    # Shutdown (se necessario)

app = FastAPI(
    title="Erasmus ChatBot API",
    description="API per il ChatBot Erasmus del Politecnico di Bari",
    version="1.0.0",
    lifespan=lifespan
)

# CORS per il frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5175")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelli Pydantic
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    use_rag: bool = True

class ChatResponse(BaseModel):
    response: str
    sources: List[str] = []
    session_id: str
    model_used: str
    context_used: bool = False
    debug_info: Optional[dict] = None

class UploadResponse(BaseModel):
    message: str
    filename: str
    chunks_processed: int

@app.get("/")
async def root():
    return {
        "message": "Erasmus ChatBot API", 
        "version": "1.0.0",
        "status": "running"
    }

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Endpoint principale per la chat"""
    try:
        response = await chat_service.get_response(
            message=request.message,
            session_id=request.session_id,
            use_rag=request.use_rag
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore nel processing: {str(e)}")

@app.post("/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """Upload di nuovi documenti per la knowledge base"""
    try:
        if not file.filename.endswith(('.md', '.txt', '.pdf')):
            raise HTTPException(
                status_code=400, 
                detail="Formato file non supportato. Usa .md, .txt o .pdf"
            )
        
        # Salva il file
        file_path = f"./documents/{file.filename}"
        os.makedirs("./documents", exist_ok=True)
        
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Processa il documento
        chunks = await document_processor.process_file(file_path)
        
        # Aggiorna la knowledge base
        await chat_service.add_documents(chunks)
        
        return UploadResponse(
            message="Documento caricato e processato con successo",
            filename=file.filename,
            chunks_processed=len(chunks)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore nell'upload: {str(e)}")

@app.get("/knowledge-base/stats")
async def get_knowledge_stats():
    """Statistiche della knowledge base"""
    stats = await chat_service.get_knowledge_stats()
    return stats

@app.delete("/knowledge-base/clear")
async def clear_knowledge_base():
    """Pulisce la knowledge base"""
    await chat_service.clear_knowledge_base()
    return {"message": "Knowledge base pulita con successo"}

@app.get("/debug/knowledge-base")
async def debug_knowledge_base():
    """Endpoint di debug per vedere il contenuto della knowledge base"""
    stats = await chat_service.get_knowledge_stats()
    
    # Aggiungi più informazioni di debug
    debug_info = {
        "stats": stats,
        "search_test": "Usa POST /debug/search per testare la ricerca",
        "available_documents": chat_service.vector_store.get_document_files() if hasattr(chat_service.vector_store, 'get_document_files') else "Non disponibile"
    }
    
    return debug_info

@app.post("/debug/search")
async def debug_search(request: dict):
    """Testa la ricerca nella knowledge base senza generare risposta"""
    query = request.get("query", "")
    if not query:
        raise HTTPException(status_code=400, detail="Query richiesta")
    
    if chat_service.vector_store.index.ntotal == 0:
        return {
            "query": query,
            "results": [],
            "message": "Knowledge base vuota"
        }
    
    # Esegui ricerca
    search_results = chat_service.vector_store.search_by_text(
        query,
        chat_service.document_processor.embedding_model,
        k=5,
        threshold=0.3
    )
    
    # Formatta risultati per debug
    formatted_results = []
    for i, result in enumerate(search_results or []):
        formatted_results.append({
            "rank": i + 1,
            "score": result.get('score', 0),
            "file_name": result['metadata']['metadata']['file_name'],
            "text_preview": result['text'][:200] + "..." if len(result['text']) > 200 else result['text'],
            "full_text_length": len(result['text'])
        })
    
    return {
        "query": query,
        "total_results": len(formatted_results),
        "knowledge_base_size": chat_service.vector_store.index.ntotal,
        "results": formatted_results
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("DEBUG", "False").lower() == "true"
    )
