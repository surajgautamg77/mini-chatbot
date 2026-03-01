from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class DocumentModel(BaseModel):
    chatbot_id: str
    filename: str
    content_type: str
    scraped_text: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[dict] = None

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "filename": "invoice.pdf",
                "content_type": "application/pdf",
                "scraped_text": "Sample text from OCR",
                "metadata": {}
            }
        }
