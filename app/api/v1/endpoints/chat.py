from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from app.services.vector_service import vector_service
from app.services.llm_service import llm_service
from app.db.mongodb import get_database
from app.models.chat import ChatMessage, ChatHistoryResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Optional
import numpy as np

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    session_id: str  # Mandatory for history tracking
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
        # 1. Embed user query using Gemini
        query_embedding = await vector_service.get_query_embedding(request.query)
        
        # 2. Vector search (Manual)
        cursor = db.chunks.find({})
        all_chunks = []
        all_embeddings = []
        
        async for chunk in cursor:
            all_chunks.append(chunk)
            all_embeddings.append(chunk["embedding"])
        
        if not all_chunks:
            # Fallback for no docs
            context_text = "No document context available."
            retrieved_chunks = []
        else:
            # Compute similarity
            similarities = cosine_similarity([query_embedding], all_embeddings)[0]
            top_indices = np.argsort(similarities)[-request.top_k:][::-1]
            retrieved_chunks = [all_chunks[i] for i in top_indices]
            context_text = "\n\n".join([f"Context: {c['content']}" for c in retrieved_chunks])
        
        # 3. Generate response using Gemini 2.5 Flash
        system_prompt = "You are a helpful AI assistant. Use the provided context to answer the user's question accurately. If the context doesn't contain the answer, use your knowledge but mention you didn't find it in the documents."
        user_prompt = f"Context:\n{context_text}\n\nQuestion: {request.query}"
        
        answer = await llm_service.generate_response(system_prompt, user_prompt)
        
        # 4. Save to Chat History
        chat_message = ChatMessage(
            session_id=request.session_id,
            query=request.query,
            answer=answer,
            sources=[{"doc_id": c["document_id"], "content": c["content"][:100]} for c in retrieved_chunks]
        )
        await db.chat_history.insert_one(chat_message.model_dump())
        
        return ChatResponse(
            answer=answer,
            sources=chat_message.sources
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{session_id}", response_model=List[ChatHistoryResponse])
async def get_chat_history(
    session_id: str,
    limit: int = Query(50, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    cursor = db.chat_history.find({"session_id": session_id}).sort("timestamp", -1).limit(limit)
    history = []
    async for entry in cursor:
        entry["id"] = str(entry["_id"])
        history.append(entry)
    
    if not history:
        raise HTTPException(status_code=404, detail="No chat history found for this session.")
        
    return history
