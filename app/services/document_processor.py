import os
import re
import markdown
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
import numpy as np
import tiktoken

class DocumentProcessor:
    """Processa documenti per la ricerca semantica (RAG)"""
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.embedding_model = SentenceTransformer(model_name)
        self.encoding = tiktoken.get_encoding("cl100k_base")
        self.chunk_size = 512  # Token per chunk
        self.chunk_overlap = 50  # Overlap tra chunks
    
    async def process_file(self, file_path: str) -> List[Dict[str, Any]]:
        """Processa un file e restituisce chunks con embeddings"""
        
        # Legge il contenuto del file
        content = await self._read_file(file_path)
        
        # Estrae testo pulito
        text = await self._extract_text(content, file_path)
        
        # Divide in chunks
        chunks = await self._chunk_text(text)
        
        # Genera embeddings
        embeddings = self.embedding_model.encode(chunks)
        
        # Combina tutto
        processed_chunks = []
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            processed_chunks.append({
                "id": f"{os.path.basename(file_path)}_{i}",
                "text": chunk,
                "embedding": embedding.tolist(),
                "source": file_path,
                "chunk_index": i,
                "metadata": {
                    "file_name": os.path.basename(file_path),
                    "file_type": self._get_file_type(file_path),
                    "tokens": len(self.encoding.encode(chunk))
                }
            })
        
        return processed_chunks
    
    async def _read_file(self, file_path: str) -> str:
        """Legge il contenuto di un file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except UnicodeDecodeError:
            # Prova con encoding diversi
            encodings = ['latin-1', 'cp1252', 'iso-8859-1']
            for encoding in encodings:
                try:
                    with open(file_path, 'r', encoding=encoding) as f:
                        return f.read()
                except UnicodeDecodeError:
                    continue
            raise Exception(f"Impossibile leggere il file {file_path}")
    
    async def _extract_text(self, content: str, file_path: str) -> str:
        """Estrae testo pulito dal contenuto"""
        
        file_ext = os.path.splitext(file_path)[1].lower()
        
        if file_ext == '.md':
            return await self._process_markdown(content)
        elif file_ext == '.txt':
            return content
        elif file_ext == '.pdf':
            return await self._process_pdf(file_path)
        else:
            return content
    
    async def _process_markdown(self, content: str) -> str:
        """Processa file Markdown"""
        
        # Converte markdown in HTML poi estrae testo
        html = markdown.markdown(content)
        
        # Rimuove tag HTML
        text = re.sub(r'<[^>]+>', '', html)
        
        # Pulisce il testo
        text = re.sub(r'\n+', '\n', text)  # Rimuove newline multipli
        text = re.sub(r'\s+', ' ', text)   # Normalizza spazi
        
        return text.strip()
    
    async def _process_pdf(self, file_path: str) -> str:
        """Processa file PDF"""
        try:
            import pypdf
            
            text = ""
            with open(file_path, 'rb') as file:
                pdf_reader = pypdf.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
            
            return text.strip()
        except ImportError:
            raise Exception("pypdf non installato. Installare con: pip install pypdf")
    
    async def _chunk_text(self, text: str) -> List[str]:
        """Divide il testo in chunks semantici"""
        
        # Prima divisione per paragrafi
        paragraphs = text.split('\n\n')
        
        chunks = []
        current_chunk = ""
        current_tokens = 0
        
        for paragraph in paragraphs:
            paragraph = paragraph.strip()
            if not paragraph:
                continue
            
            paragraph_tokens = len(self.encoding.encode(paragraph))
            
            # Se il paragrafo stesso è troppo lungo, lo divide
            if paragraph_tokens > self.chunk_size:
                # Salva il chunk corrente se non vuoto
                if current_chunk:
                    chunks.append(current_chunk.strip())
                    current_chunk = ""
                    current_tokens = 0
                
                # Divide il paragrafo lungo
                sub_chunks = await self._split_long_paragraph(paragraph)
                chunks.extend(sub_chunks)
                
            else:
                # Controlla se aggiungere al chunk corrente
                if current_tokens + paragraph_tokens <= self.chunk_size:
                    current_chunk += "\n\n" + paragraph if current_chunk else paragraph
                    current_tokens += paragraph_tokens
                else:
                    # Salva il chunk corrente e inizia uno nuovo
                    if current_chunk:
                        chunks.append(current_chunk.strip())
                    
                    current_chunk = paragraph
                    current_tokens = paragraph_tokens
        
        # Salva l'ultimo chunk
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        return chunks
    
    async def _split_long_paragraph(self, paragraph: str) -> List[str]:
        """Divide paragrafi troppo lunghi"""
        
        sentences = re.split(r'[.!?]+', paragraph)
        chunks = []
        current_chunk = ""
        current_tokens = 0
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
            
            sentence_tokens = len(self.encoding.encode(sentence))
            
            if current_tokens + sentence_tokens <= self.chunk_size:
                current_chunk += ". " + sentence if current_chunk else sentence
                current_tokens += sentence_tokens
            else:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = sentence
                current_tokens = sentence_tokens
        
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        return chunks
    
    def _get_file_type(self, file_path: str) -> str:
        """Determina il tipo di file"""
        ext = os.path.splitext(file_path)[1].lower()
        return {
            '.md': 'markdown',
            '.txt': 'text',
            '.pdf': 'pdf'
        }.get(ext, 'unknown')
    
    def get_embedding_dimension(self) -> int:
        """Restituisce la dimensione degli embeddings"""
        return self.embedding_model.get_sentence_embedding_dimension()
