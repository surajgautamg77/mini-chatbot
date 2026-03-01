from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class DocumentBase(BaseModel):
    filename: str
    content_type: str
    created_at: datetime

class DocumentSummary(DocumentBase):
    id: str

    class Config:
        from_attributes = True

class DocumentResponse(DocumentBase):
    id: str
    scraped_text: str

    class Config:
        from_attributes = True
