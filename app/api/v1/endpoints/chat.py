from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.services.vector_service import vector_service
from app.services.llm_service import llm_service
from app.db.mongodb import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
from sklearn.metrics.pairwise import cosine_similarity
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
        # 1. Embed user query
        query_embedding = await vector_service.get_query_embedding(request.query)
        
        # 2. Perform vector search in MongoDB 
        # (Manual retrieval for small-to-medium datasets; 
        # for Atlas, use $vectorSearch aggregation)
        cursor = db.chunks.find({})
        all_chunks = []
        all_embeddings = []
        
        async for chunk in cursor:
            all_chunks.append(chunk)
            all_embeddings.append(chunk["embedding"])
        
        if not all_chunks:
            raise HTTPException(status_code=404, detail="No document chunks found to search against.")

        # Compute cosine similarity
        similarities = cosine_similarity([query_embedding], all_embeddings)[0]
        
        # Sort by similarity and get top K
        top_indices = np.argsort(similarities)[-request.top_k:][::-1]
        
        retrieved_chunks = [all_chunks[i] for i in top_indices]
        context_text = "

".join([f"Source (Doc: {c['document_id']}): {c['content']}" for c in retrieved_chunks])
        
        # 3. Construct prompt for Llama 3.1
        system_prompt = "You are a helpful AI assistant. Use only the following context to answer the user's question. If you don't know the answer, say you don't know based on the provided documents. Keep it concise."
        
        llama_prompt = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>

{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>

Context:
{context_text}

Question:
{request.query}<|eot_id|><|start_header_id|>assistant<|end_header_id|>"""

        # 4. Generate response using vLLM
        answer = await llm_service.generate_response(llama_prompt)
        
        return ChatResponse(
            answer=answer.strip(),
            sources=[{"doc_id": c["document_id"], "content": c["content"][:200]} for c in retrieved_chunks]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
