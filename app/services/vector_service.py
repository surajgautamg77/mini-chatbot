from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Dict, Any

class VectorService:
    def __init__(self):
        # BGE-small-en-v1.5 is highly efficient on CPU
        self.model = SentenceTransformer('BAAI/bge-small-en-v1.5')
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=512,
            chunk_overlap=50,
            length_function=len,
        )

    async def create_chunks_and_embeddings(self, text: str, doc_id: str) -> List[Dict[str, Any]]:
        if not text.strip():
            return []
            
        # Split text into chunks
        chunks = self.text_splitter.split_text(text)
        
        # Generate embeddings for all chunks at once
        # BGE models work best with this prefix for symmetric retrieval
        embeddings = self.model.encode(chunks, normalize_embeddings=True)
        
        chunk_data = []
        for i, (chunk_text, embedding) in enumerate(zip(chunks, embeddings)):
            chunk_data.append({
                "document_id": doc_id,
                "chunk_index": i,
                "content": chunk_text,
                "embedding": embedding.tolist(),  # Store as list for MongoDB
                "metadata": {
                    "source_doc_id": doc_id,
                    "chunk_count": len(chunks)
                }
            })
            
        return chunk_data

vector_service = VectorService()
