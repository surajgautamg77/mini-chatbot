import google.generativeai as genai
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.config import settings
from typing import List, Dict, Any

class VectorService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        # Using the specific model from your request
        self.embedding_model = "models/gemini-embedding-001"
        # Setting a target dimension for the embeddings
        self.output_dimensionality = 768 
        
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100,
            length_function=len,
        )

    async def create_chunks_and_embeddings(self, text: str, doc_id: str) -> List[Dict[str, Any]]:
        if not text.strip():
            return []
            
        chunks = self.text_splitter.split_text(text)
        chunk_data = []

        # We process chunks to get embeddings from Gemini
        for i, chunk_text in enumerate(chunks):
            try:
                # Using the exact model and structure from your curl example via SDK
                response = genai.embed_content(
                    model=self.embedding_model,
                    content=chunk_text,
                    task_type="retrieval_document",
                    output_dimensionality=self.output_dimensionality
                )
                
                embedding_values = response['embedding']
                
                chunk_data.append({
                    "document_id": doc_id,
                    "chunk_index": i,
                    "content": chunk_text,
                    "embedding": embedding_values,
                    "metadata": {
                        "source_doc_id": doc_id,
                        "chunk_count": len(chunks),
                        "model": self.embedding_model,
                        "dimension": self.output_dimensionality
                    }
                })
            except Exception as e:
                print(f"Error embedding chunk {i}: {str(e)}")
                continue
            
        return chunk_data

    async def get_query_embedding(self, query: str) -> List[float]:
        response = genai.embed_content(
            model=self.embedding_model,
            content=query,
            task_type="retrieval_query",
            output_dimensionality=self.output_dimensionality
        )
        return response['embedding']

vector_service = VectorService()
