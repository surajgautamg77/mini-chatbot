from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional

class ChatMessage(BaseModel):
    session_id: str
    query: str
    answer: str
    sources: List[dict]
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatHistoryResponse(BaseModel):
    id: str
    session_id: str
    query: str
    answer: str
    timestamp: datetime

    class Config:
        from_attributes = True
