import google.generativeai as genai
from app.core.config import settings

class LLMService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        # Using the latest Gemini 2.5 Flash model
        self.model_name = 'gemini-2.5-flash'
        self.model = genai.GenerativeModel(self.model_name)

    async def generate_response(self, system_prompt: str, user_prompt: str) -> str:
        try:
            # Constructing the message structure for Gemini
            # Using a single turn approach with context prepended
            prompt = f"{system_prompt}\n\nContext and Question:\n{user_prompt}"
            
            response = self.model.generate_content(prompt)
            
            if hasattr(response, 'text'):
                return response.text
            else:
                # Handle cases where the response might be blocked or empty
                return "The model did not return a text response. Please check the safety settings or query content."
        except Exception as e:
            return f"Error from Gemini {self.model_name}: {str(e)}"

llm_service = LLMService()
