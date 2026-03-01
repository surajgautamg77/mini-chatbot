import pytesseract
from PIL import Image
import io
import fitz  # PyMuPDF
import docx
import pandas as pd
from typing import Tuple

class DocumentProcessor:
    @staticmethod
    async def process_file(file_content: bytes, filename: str, content_type: str) -> str:
        ext = filename.split(".")[-1].lower()
        
        if content_type.startswith("image/") or ext in ["jpg", "jpeg", "png", "tiff", "bmp"]:
            return await DocumentProcessor._extract_from_image(file_content)
        
        elif ext == "pdf" or content_type == "application/pdf":
            return await DocumentProcessor._extract_from_pdf(file_content)
        
        elif ext == "docx" or content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return await DocumentProcessor._extract_from_docx(file_content)
        
        elif ext in ["xlsx", "xls"] or content_type in ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"]:
            return await DocumentProcessor._extract_from_excel(file_content)
        
        elif ext == "txt" or content_type == "text/plain":
            return file_content.decode("utf-8")
        
        else:
            raise Exception(f"Unsupported file type: {content_type}")

    @staticmethod
    async def _extract_from_image(file_content: bytes) -> str:
        image = Image.open(io.BytesIO(file_content))
        text = pytesseract.image_to_string(image)
        return text.strip()

    @staticmethod
    async def _extract_from_pdf(file_content: bytes) -> str:
        doc = fitz.open(stream=file_content, filetype="pdf")
        text = ""
        for page in doc:
            page_text = page.get_text()
            if page_text.strip():
                text += page_text + "\n"
            else:
                # If no digital text, attempt OCR on the page image
                pix = page.get_pixmap()
                img = Image.open(io.BytesIO(pix.tobytes()))
                text += pytesseract.image_to_string(img) + "\n"
        doc.close()
        return text.strip()

    @staticmethod
    async def _extract_from_docx(file_content: bytes) -> str:
        doc = docx.Document(io.BytesIO(file_content))
        return "\n".join([para.text for para in doc.paragraphs]).strip()

    @staticmethod
    async def _extract_from_excel(file_content: bytes) -> str:
        df = pd.read_excel(io.BytesIO(file_content))
        return df.to_string(index=False)

document_processor = DocumentProcessor()
