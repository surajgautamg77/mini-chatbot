from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Document OCR & AI Chat"
    MONGODB_URL: str
    DATABASE_NAME: str = "document_db"
    GEMINI_API_KEY: str

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
