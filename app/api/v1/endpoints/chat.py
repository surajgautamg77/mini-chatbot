from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.services.vector_service import vector_service
from app.services.llm_service import llm_service
from app.db.mongodb import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
from sklearn.metrics.pairwise import cosine_similarity
from typing import List
import numpy as np

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    top_k: int = 5

class ChatResponse(BaseModel):
    answer: str
    sources: list

@router.post("/", response_model=ChatResponse)
async def chat_with_documents(
    request: ChatRequest,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    try:
        # 1. Embed user query using OpenAI
        query_embedding = await vector_service.get_query_embedding(request.query)
        
        # 2. Vector search (Manual)
        cursor = db.chunks.find({})
        all_chunks = []
        all_embeddings = []
        
        async for chunk in cursor:
            all_chunks.append(chunk)
            all_embeddings.append(chunk["embedding"])
        
        if not all_chunks:
            raise HTTPException(status_code=404, detail="No document chunks found.")

        # Compute similarity
        similarities = cosine_similarity([query_embedding], all_embeddings)[0]
        top_indices = np.argsort(similarities)[-request.top_k:][::-1]
        
        retrieved_chunks = [all_chunks[i] for i in top_indices]
        context_text = "\n\n".join([f"Context: {c['content']}" for c in retrieved_chunks])
        
        # 3. Generate response using OpenAI
        system_prompt = "You are a helpful AI assistant. Use the provided context to answer the user's question accurately. If the context doesn't contain the answer, say you don't know based on the provided documents."
        user_prompt = f"Context:\n{context_text}\n\nQuestion: {request.query}"
        
        answer = await llm_service.generate_response(system_prompt, user_prompt)
        
        return ChatResponse(
            answer=answer,
            sources=[{"doc_id": c["document_id"], "content": c["content"][:200]} for c in retrieved_chunks]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
