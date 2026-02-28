from vllm import LLM, SamplingParams
from typing import List

class LLMService:
    def __init__(self, model_name: str = "meta-llama/Llama-3.1-8B-Instruct"):
        # Note: vLLM requires a GPU for Llama-3.1-8B.
        # If no GPU is found, this will likely fail unless configured for CPU/OpenVINO.
        # Ensure you have the model or access on HuggingFace.
        self.llm = LLM(model=model_name, dtype="float16")
        self.sampling_params = SamplingParams(
            temperature=0.7,
            top_p=0.9,
            max_tokens=512
        )

    async def generate_response(self, prompt: str) -> str:
        outputs = self.llm.generate([prompt], self.sampling_params)
        return outputs[0].outputs[0].text

llm_service = LLMService()
