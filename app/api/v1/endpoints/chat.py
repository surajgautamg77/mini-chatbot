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
    chatbot_id: str
    query: str
    session_id: str
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
        query_embedding = await vector_service.get_query_embedding(request.query)
        
        # Search ONLY in chunks belonging to THIS chatbot
        cursor = db.chunks.find({"chatbot_id": request.chatbot_id})
        all_chunks = []
        all_embeddings = []
        
        async for chunk in cursor:
            all_chunks.append(chunk)
            all_embeddings.append(chunk["embedding"])
        
        if not all_chunks:
            context_text = "No document context available for this bot."
            retrieved_chunks = []
        else:
            similarities = cosine_similarity([query_embedding], all_embeddings)[0]
            top_indices = np.argsort(similarities)[-request.top_k:][::-1]
            retrieved_chunks = [all_chunks[i] for i in top_indices]
            context_text = "\n\n".join([f"Context: {c['content']}" for c in retrieved_chunks])
        
        system_prompt = (
            "You are a helpful and natural-sounding AI assistant. Respond directly. "
            "Speak in a genuine tone. Use context to be accurate."
        )
        user_prompt = f"Context:\n{context_text}\n\nQuestion: {request.query}"
        
        answer = await llm_service.generate_response(system_prompt, user_prompt)
        
        chat_message = ChatMessage(
            chatbot_id=request.chatbot_id,
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

@router.get("/sessions", response_model=List[dict])
async def get_chatbot_sessions(
    chatbot_id: str = Query(...),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Use aggregation to find unique sessions and their last message time
    pipeline = [
        {"$match": {"chatbot_id": chatbot_id}},
        {"$sort": {"timestamp": -1}},
        {
            "$group": {
                "_id": "$session_id",
                "last_message": {"$first": "$query"},
                "timestamp": {"$first": "$timestamp"},
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"timestamp": -1}}
    ]
    
    cursor = db.chat_history.aggregate(pipeline)
    sessions = []
    async for sess in cursor:
        sessions.append({
            "session_id": sess["_id"],
            "last_message": sess["last_message"],
            "timestamp": sess["timestamp"],
            "message_count": sess["count"]
        })
    return sessions

@router.get("/all-history", response_model=List[ChatHistoryResponse])
async def get_all_chat_history(
    chatbot_id: str = Query(...),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    cursor = db.chat_history.find({"chatbot_id": chatbot_id}).sort("timestamp", -1).skip(skip).limit(limit)
    history = []
    async for entry in cursor:
        entry["id"] = str(entry["_id"])
        history.append(entry)
    return history

@router.get("/history/{session_id}", response_model=List[ChatHistoryResponse])
async def get_chat_history(
    session_id: str,
    chatbot_id: str = Query(...),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    cursor = db.chat_history.find({
        "session_id": session_id,
        "chatbot_id": chatbot_id
    }).sort("timestamp", -1)
    
    history = []
    async for entry in cursor:
        entry["id"] = str(entry["_id"])
        history.append(entry)
    return history
