from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Query
from app.services.document_processor import document_processor
from app.services.vector_service import vector_service
from app.db.mongodb import get_database
from app.models.document import DocumentModel
from app.schemas.document import DocumentSummary, DocumentResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from typing import List

router = APIRouter()

@router.post("/upload", status_code=201)
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    try:
        content = await file.read()
        # 1. Process and scrape text
        scraped_text = await document_processor.process_file(content, file.filename, file.content_type)
        
        # 2. Save document metadata
        document = DocumentModel(
            filename=file.filename,
            content_type=file.content_type,
            scraped_text=scraped_text
        )
        doc_dict = document.model_dump()
        doc_result = await db.documents.insert_one(doc_dict)
        doc_id = str(doc_result.inserted_id)

        # 3. Create chunks and embeddings (separate table/collection)
        chunks_data = await vector_service.create_chunks_and_embeddings(scraped_text, doc_id)
        
        if chunks_data:
            # Insert all chunks into the 'chunks' collection
            await db.chunks.insert_many(chunks_data)
        
        return {
            "id": doc_id,
            "filename": file.filename,
            "scraped_text": scraped_text,
            "chunk_count": len(chunks_data),
            "message": "Document processed, chunked, and embedded successfully."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await file.close()

@router.get("/", response_model=List[DocumentSummary])
async def list_documents(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    cursor = db.documents.find({}, {"scraped_text": 0}).skip(skip).limit(limit)
    documents = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        documents.append(doc)
    return documents

@router.get("/{doc_id}", response_model=DocumentResponse)
async def get_document(
    doc_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    if not ObjectId.is_valid(doc_id):
        raise HTTPException(status_code=400, detail="Invalid document ID format.")
    
    doc = await db.documents.find_one({"_id": ObjectId(doc_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    
    doc["id"] = str(doc["_id"])
    return doc

@router.delete("/{doc_id}", status_code=200)
async def delete_document(
    doc_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    if not ObjectId.is_valid(doc_id):
        raise HTTPException(status_code=400, detail="Invalid document ID format.")
    
    # Delete the document and its associated chunks
    await db.chunks.delete_many({"document_id": doc_id})
    result = await db.documents.delete_one({"_id": ObjectId(doc_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Document not found.")
    
    return {"message": "Document and its vector chunks deleted successfully."}
