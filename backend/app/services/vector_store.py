import os
import json
import faiss
import numpy as np
from typing import List, Dict, Any, Optional
import pickle

class VectorStore:
    """Vector database per la ricerca semantica"""
    
    def __init__(self, dimension: int = 384, index_path: str = "./vector_db"):
        self.dimension = dimension
        self.index_path = index_path
        self.index_file = os.path.join(index_path, "faiss.index")
        self.metadata_file = os.path.join(index_path, "metadata.json")
        
        # Crea directory se non esiste
        os.makedirs(index_path, exist_ok=True)
        
        # Inizializza FAISS index
        self.index = faiss.IndexFlatIP(dimension)  # Inner Product per similarità coseno
        self.documents = []
        self.metadata = []
        
        # Carica index esistente se disponibile
        self._load_index()
    
    def add_documents(self, documents: List[Dict[str, Any]]):
        """Aggiunge documenti al vector store"""
        
        embeddings = []
        for doc in documents:
            # Verifica che l'embedding abbia la dimensione corretta
            embedding = np.array(doc["embedding"], dtype=np.float32)
            if embedding.shape[0] != self.dimension:
                raise ValueError(f"Embedding dimension mismatch: expected {self.dimension}, got {embedding.shape[0]}")
            
            embeddings.append(embedding)
            self.documents.append(doc["text"])
            self.metadata.append({
                "id": doc["id"],
                "source": doc["source"],
                "chunk_index": doc["chunk_index"],
                "metadata": doc["metadata"]
            })
        
        # Aggiunge al FAISS index
        embeddings_array = np.array(embeddings, dtype=np.float32)
        
        # Normalizza per similarità coseno
        faiss.normalize_L2(embeddings_array)
        
        self.index.add(embeddings_array)
        
        # Salva automaticamente
        self._save_index()
    
    def search(self, query_embedding: np.ndarray, k: int = 5, threshold: float = 0.3) -> List[Dict[str, Any]]:
        """Cerca documenti simili"""
        
        if self.index.ntotal == 0:
            return []
        
        # Normalizza query embedding
        query_embedding = np.array(query_embedding, dtype=np.float32).reshape(1, -1)
        faiss.normalize_L2(query_embedding)
        
        # Esegue la ricerca
        scores, indices = self.index.search(query_embedding, min(k, self.index.ntotal))
        
        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx < len(self.documents) and score >= threshold:
                results.append({
                    "text": self.documents[idx],
                    "score": float(score),
                    "metadata": self.metadata[idx],
                    "index": int(idx)
                })
        
        return sorted(results, key=lambda x: x["score"], reverse=True)
    
    def search_by_text(self, query: str, embedding_model, k: int = 5, threshold: float = 0.3) -> List[Dict[str, Any]]:
        """Cerca usando testo (genera embedding automaticamente)"""
        
        # Genera embedding per la query
        query_embedding = embedding_model.encode([query])[0]
        
        return self.search(query_embedding, k, threshold)
    
    def get_stats(self) -> Dict[str, Any]:
        """Statistiche del vector store"""
        
        sources = {}
        total_chunks = len(self.documents)
        
        for meta in self.metadata:
            source = meta["source"]
            if source not in sources:
                sources[source] = {"chunks": 0, "files": set()}
            sources[source]["chunks"] += 1
            sources[source]["files"].add(meta["metadata"]["file_name"])
        
        # Converti set in list per JSON serialization
        for source in sources:
            sources[source]["files"] = list(sources[source]["files"])
        
        return {
            "total_documents": total_chunks,
            "total_sources": len(sources),
            "index_size": self.index.ntotal,
            "dimension": self.dimension,
            "sources": sources
        }
    
    def clear(self):
        """Pulisce il vector store"""
        self.index = faiss.IndexFlatIP(self.dimension)
        self.documents = []
        self.metadata = []
        
        # Rimuove file salvati
        if os.path.exists(self.index_file):
            os.remove(self.index_file)
        if os.path.exists(self.metadata_file):
            os.remove(self.metadata_file)
    
    def remove_source(self, source_path: str):
        """Rimuove tutti i documenti da una fonte specifica"""
        
        indices_to_remove = []
        for i, meta in enumerate(self.metadata):
            if meta["source"] == source_path:
                indices_to_remove.append(i)
        
        if not indices_to_remove:
            return
        
        # Ricostruisce l'index senza i documenti rimossi
        remaining_embeddings = []
        new_documents = []
        new_metadata = []
        
        for i in range(len(self.documents)):
            if i not in indices_to_remove:
                # Recupera embedding dall'index (questo è un workaround, idealmente dovresti salvare gli embeddings)
                new_documents.append(self.documents[i])
                new_metadata.append(self.metadata[i])
        
        # Ricrea l'index (nota: questo richiede di rigenerare gli embeddings)
        # Per ora implementiamo una versione semplificata
        self.documents = new_documents
        self.metadata = new_metadata
        
        # Ricostruisci l'index - questo richiede di avere gli embeddings originali
        # Per ora implementiamo clear e re-add
        print(f"Attenzione: rimozione parziale non completamente implementata. Considera di ricostruire l'index.")
    
    def _save_index(self):
        """Salva l'index su disco"""
        try:
            # Salva FAISS index
            faiss.write_index(self.index, self.index_file)
            
            # Salva metadata e documenti
            data = {
                "documents": self.documents,
                "metadata": self.metadata,
                "dimension": self.dimension
            }
            
            with open(self.metadata_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
                
        except Exception as e:
            print(f"Errore nel salvataggio dell'index: {e}")
    
    def _load_index(self):
        """Carica l'index da disco"""
        try:
            if os.path.exists(self.index_file) and os.path.exists(self.metadata_file):
                # Carica FAISS index
                self.index = faiss.read_index(self.index_file)
                
                # Carica metadata e documenti
                with open(self.metadata_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                self.documents = data.get("documents", [])
                self.metadata = data.get("metadata", [])
                
                print(f"Caricato vector store con {len(self.documents)} documenti")
                
        except Exception as e:
            print(f"Errore nel caricamento dell'index: {e}")
            # Ricrea index vuoto in caso di errore
            self.index = faiss.IndexFlatIP(self.dimension)
            self.documents = []
            self.metadata = []
