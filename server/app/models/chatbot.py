from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ChatbotModel(BaseModel):
    name: str
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ChatbotResponse(ChatbotModel):
    id: str

    class Config:
        from_attributes = True
