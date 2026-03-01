# Document OCR API

A medium-to-large scalable FastAPI project for document uploading, OCR scraping (using pytesseract), and MongoDB storage.

## Prerequisites

- **Python 3.10+**
- **MongoDB** (Running locally or on Atlas)
- **Tesseract OCR Engine**: You must have Tesseract installed on your system.
  - **Windows**: [Install via UB Mannheim](https://github.com/UB-Mannheim/tesseract/wiki)
  - **Linux**: `sudo apt install tesseract-ocr`
  - **macOS**: `brew install tesseract`

## Setup

1. **Clone the repository** (if applicable).
2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Configure environment variables**:
   - Copy `.env.example` to `.env`.
   - Update `MONGODB_URL` with your MongoDB connection string.

## Running the Project

```bash
uvicorn app.main:app --reload
```

## API Documentation

Once the project is running, visit:
- Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

## Endpoint: Upload Document

- **URL**: `/api/v1/documents/upload`
- **Method**: `POST`
- **Payload**: `multipart/form-data` with a `file` field.
- **Support**: Currently supports image files for OCR processing.
