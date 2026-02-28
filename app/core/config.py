from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Document OCR API"
    MONGODB_URL: str
    DATABASE_NAME: str = "document_db"

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
