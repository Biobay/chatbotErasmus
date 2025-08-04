import os
import uuid
import asyncio
from typing import Dict, Any, List, Optional
from datetime import datetime

from .llm_service import LLMService, LLMProvider
from .document_processor import DocumentProcessor
from .vector_store import VectorStore

class ChatService:
    """Servizio principale per la chat con RAG"""
    
    def __init__(self):
        self.llm_service = LLMService(default_provider=LLMProvider.GEMINI)
        self.document_processor = DocumentProcessor()
        self.vector_store = VectorStore(
            dimension=self.document_processor.get_embedding_dimension()
        )
        self.sessions = {}  # Gestione sessioni utente
        
    async def initialize(self):
        """Inizializza il servizio caricando documenti esistenti"""
        # Carica documenti dalla cartella documents se esistono
        documents_path = "./documents"
        if os.path.exists(documents_path):
            await self._load_existing_documents(documents_path)
    
    async def get_response(
        self, 
        message: str, 
        session_id: Optional[str] = None,
        use_rag: bool = True,
        provider: Optional[LLMProvider] = None
    ) -> Dict[str, Any]:
        """Genera una risposta alla domanda dell'utente"""
        
        # Gestione sessione
        if not session_id:
            session_id = str(uuid.uuid4())
        
        if session_id not in self.sessions:
            self.sessions[session_id] = {
                "created_at": datetime.now(),
                "messages": [],
                "context": ""
            }
        
        session = self.sessions[session_id]
        
        # Aggiungi messaggio alla cronologia
        session["messages"].append({
            "role": "user",
            "content": message,
            "timestamp": datetime.now()
        })
        
        # Recupera contesto se RAG è abilitato
        context = ""
        sources = []

        if use_rag and self.vector_store.index.ntotal > 0:
            print(f"🔍 RAG ATTIVO - Ricerca contesto per: '{message[:50]}...'")
            
            # Cerca documenti rilevanti
            search_results = self.vector_store.search_by_text(
                message,
                self.document_processor.embedding_model,
                k=5,
                threshold=0.3
            )
            
            if search_results:
                print(f"📚 CONTESTO TROVATO - {len(search_results)} documenti rilevanti:")
                context_parts = []
                for i, result in enumerate(search_results):
                    score = result.get('score', 0)
                    # Correzione: accedi direttamente a 'file_name' nei metadati
                    file_name = result['metadata'].get('file_name', 'sconosciuto')
                    text_preview = result['text'][:100]
                    print(f"   {i+1}. {file_name} (score: {score:.3f}) - {text_preview}...")
                    
                    context_parts.append(f"[Fonte: {file_name}]\n{result['text']}")
                    sources.append(file_name)
                
                context = "\n\n---\n\n".join(context_parts)
                print(f"✅ CONTESTO PREPARATO - {len(context)} caratteri totali")
            else:
                print("❌ NESSUN CONTESTO TROVATO - Score di similarità troppo basso")
        elif use_rag and self.vector_store.index.ntotal == 0:
            print("⚠️  RAG RICHIESTO ma knowledge base vuota")
        else:
            print("🚫 RAG DISABILITATO - Risposta solo con LLM")
        
        # Genera risposta usando LLM
        if context:
            print(f"📝 USANDO CONTESTO RAG da {len(set(sources))} file diversi")
        else:
            print(f"💭 RISPOSTA SOLO CON CONOSCENZA GENERALE del modello")
            
        llm_response = await self.llm_service.generate_response(
            prompt=message,
            context=context,
            provider=provider
        )
        
        print(f"🤖 RISPOSTA GENERATA con {llm_response.get('provider', 'provider sconosciuto')}")
        
        # Aggiungi risposta alla cronologia
        session["messages"].append({
            "role": "assistant", 
            "content": llm_response["response"],
            "timestamp": datetime.now(),
            "metadata": {
                "provider": llm_response["provider"],
                "success": llm_response["success"],
                "sources": sources,
                "tokens_used": llm_response.get("tokens_used", 0)
            }
        })
        
        return {
            "response": llm_response["response"],
            "sources": list(set(sources)),  # Rimuove duplicati
            "session_id": session_id,
            "model_used": llm_response["provider"],
            "success": llm_response["success"],
            "context_used": bool(context),
            "debug_info": {
                "rag_enabled": use_rag,
                "documents_in_knowledge_base": self.vector_store.index.ntotal,
                "context_length": len(context) if context else 0,
                "sources_count": len(set(sources))
            }
        }
    
    async def add_documents(self, documents: List[Dict[str, Any]]):
        """Aggiunge nuovi documenti al vector store"""
        print(f"➕ AGGIUNTA DOCUMENTI - {len(documents)} nuovi chunks")
        self.vector_store.add_documents(documents)
        total_docs = self.vector_store.index.ntotal
        print(f"📊 KNOWLEDGE BASE AGGIORNATA - {total_docs} chunks totali")
    
    async def get_knowledge_stats(self) -> Dict[str, Any]:
        """Restituisce statistiche della knowledge base"""
        stats = self.vector_store.get_stats()
        
        # Aggiungi statistiche sulle sessioni
        stats["sessions"] = {
            "active_sessions": len(self.sessions),
            "total_messages": sum(len(session["messages"]) for session in self.sessions.values())
        }
        
        return stats
    
    async def clear_knowledge_base(self):
        """Pulisce la knowledge base"""
        self.vector_store.clear()
    
    async def get_session_history(self, session_id: str) -> Dict[str, Any]:
        """Recupera la cronologia di una sessione"""
        if session_id in self.sessions:
            return {
                "session_id": session_id,
                "created_at": self.sessions[session_id]["created_at"],
                "messages": self.sessions[session_id]["messages"]
            }
        return {"error": "Sessione non trovata"}
    
    async def clear_session(self, session_id: str) -> bool:
        """Pulisce una sessione specifica"""
        if session_id in self.sessions:
            del self.sessions[session_id]
            return True
        return False
    
    async def _load_existing_documents(self, documents_path: str):
        """Carica documenti esistenti dalla cartella"""
        import os
        
        supported_extensions = ['.md', '.txt', '.pdf']
        loaded_files = []
        
        print(f"📁 CARICAMENTO DOCUMENTI da {documents_path}")
        
        for filename in os.listdir(documents_path):
            file_path = os.path.join(documents_path, filename)
            
            if os.path.isfile(file_path):
                file_ext = os.path.splitext(filename)[1].lower()
                
                if file_ext in supported_extensions:
                    try:
                        print(f"📄 Processando {filename}...")
                        chunks = await self.document_processor.process_file(file_path)
                        if chunks:
                            await self.add_documents(chunks)
                            loaded_files.append(filename)
                            print(f"✅ {filename} - {len(chunks)} chunks aggiunti")
                        else:
                            print(f"⚠️ {filename} - Nessun chunk generato")
                            
                    except Exception as e:
                        print(f"❌ Errore nel caricamento di {filename}: {e}")
                else:
                    print(f"⏭️ {filename} - Formato non supportato ({file_ext})")
        
        if loaded_files:
            total_documents = self.vector_store.index.ntotal
            print(f"🎉 CARICAMENTO COMPLETATO - {len(loaded_files)} documenti, {total_documents} chunks totali nella knowledge base")
            print(f"📚 File caricati: {', '.join(loaded_files)}")
        else:
            print("📭 Nessun documento trovato o caricato")
    
    async def update_document(self, file_path: str):
        """Aggiorna un documento specifico (rimuove vecchio e aggiunge nuovo)"""
        
        # Rimuovi il documento esistente (implementazione semplificata)
        # In un sistema reale, useresti hash del file per tracking
        
        # Processa il nuovo documento
        chunks = await self.document_processor.process_file(file_path)
        
        if chunks:
            await self.add_documents(chunks)
            return len(chunks)
        
        return 0
    
    def get_available_providers(self) -> List[str]:
        """Restituisce i provider LLM disponibili"""
        providers = []
        
        if os.getenv("GEMINI_API_KEY"):
            providers.append("gemini")
        if os.getenv("OPENAI_API_KEY"):
            providers.append("openai")
        if os.getenv("ANTHROPIC_API_KEY"):
            providers.append("anthropic")
        
        return providers
