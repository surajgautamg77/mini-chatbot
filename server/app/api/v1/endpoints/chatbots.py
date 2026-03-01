from fastapi import APIRouter, HTTPException, Depends, Body
from app.db.mongodb import get_database
from app.models.chatbot import ChatbotModel, ChatbotResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from typing import List

router = APIRouter()

@router.post("/", response_model=ChatbotResponse)
async def create_chatbot(
    name: str = Body(..., embed=True),
    description: str = Body(None, embed=True),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    chatbot = ChatbotModel(name=name, description=description)
    result = await db.chatbots.insert_one(chatbot.model_dump())
    
    return {
        "id": str(result.inserted_id),
        **chatbot.model_dump()
    }

@router.get("/", response_model=List[ChatbotResponse])
async def list_chatbots(
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    cursor = db.chatbots.find({}).sort("created_at", -1)
    chatbots = []
    async for bot in cursor:
        bot["id"] = str(bot["_id"])
        chatbots.append(bot)
    return chatbots

@router.get("/{bot_id}", response_model=ChatbotResponse)
async def get_chatbot(
    bot_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    if not ObjectId.is_valid(bot_id):
        raise HTTPException(status_code=400, detail="Invalid Chatbot ID")
    
    bot = await db.chatbots.find_one({"_id": ObjectId(bot_id)})
    if not bot:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    
    bot["id"] = str(bot["_id"])
    return bot

@router.delete("/{bot_id}")
async def delete_chatbot(
    bot_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    if not ObjectId.is_valid(bot_id):
        raise HTTPException(status_code=400, detail="Invalid Chatbot ID")
    
    # 1. Delete all associated chunks
    # Note: Chunks are associated via document_id, so we need to find docs first or add bot_id to chunks
    # For efficiency, I'll update VectorService to add chatbot_id to chunks too.
    await db.chunks.delete_many({"chatbot_id": bot_id})
    
    # 2. Delete all documents
    await db.documents.delete_many({"chatbot_id": bot_id})
    
    # 3. Delete chat history
    await db.chat_history.delete_many({"chatbot_id": bot_id})
    
    # 4. Delete the bot itself
    result = await db.chatbots.delete_one({"_id": ObjectId(bot_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    
    return {"message": "Chatbot and all associated data deleted successfully"}
