import os
import google.generativeai as genai
import openai
import requests
from typing import Dict, Any, Optional
from enum import Enum

class LLMProvider(Enum):
    GEMINI = "gemini"
    OPENAI = "openai"
    ANTHROPIC = "anthropic"

class LLMService:
    """Servizio per gestire diverse API di LLM"""
    
    def __init__(self, default_provider: LLMProvider = LLMProvider.GEMINI):
        self.default_provider = default_provider
        self.setup_clients()
    
    def setup_clients(self):
        """Configura i client per le API"""
        # Gemini
        self.gemini_model = None
        if os.getenv("GEMINI_API_KEY"):
            try:
                genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
                self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
                print("✅ Gemini configurato correttamente")
            except Exception as e:
                print(f"❌ Errore configurazione Gemini: {e}")
                self.gemini_model = None
        else:
            print("⚠️ GEMINI_API_KEY non trovata")
        
        # OpenAI
        if os.getenv("OPENAI_API_KEY"):
            openai.api_key = os.getenv("OPENAI_API_KEY")
        
        # Anthropic API key per Claude
        self.anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    
    async def generate_response(
        self, 
        prompt: str, 
        context: str = "", 
        provider: Optional[LLMProvider] = None,
        max_tokens: int = 1000,
        temperature: float = 0.7
    ) -> Dict[str, Any]:
        """Genera una risposta usando l'LLM specificato"""
        
        provider = provider or self.default_provider
        
        # Costruisce il prompt finale
        full_prompt = self._build_erasmus_prompt(prompt, context)
        
        try:
            if provider == LLMProvider.GEMINI:
                result = await self._call_gemini(full_prompt, max_tokens, temperature)
                if "error" in result and result["error"] == "gemini_not_configured":
                    # Fallback a risposta predefinita
                    return {
                        "response": "🎓 Ciao! Sono ChatBot Erasmus! Per il momento sto funzionando in modalità demo. Per domande specifiche su Erasmus, contatta i coordinatori del tuo corso. Come posso aiutarti?",
                        "model_used": "demo",
                        "error": None
                    }
                return result
            elif provider == LLMProvider.OPENAI:
                return await self._call_openai(full_prompt, max_tokens, temperature)
            elif provider == LLMProvider.ANTHROPIC:
                return await self._call_anthropic(full_prompt, max_tokens, temperature)
            else:
                raise ValueError(f"Provider {provider} non supportato")
                
        except Exception as e:
            # Fallback ad altri provider se disponibili
            return await self._try_fallback(full_prompt, provider, max_tokens, temperature)
    
    def _build_erasmus_prompt(self, question: str, context: str = "") -> str:
        """Costruisce un prompt specifico per il dominio Erasmus"""
        
        system_prompt = """Sei un assistente AI specializzato nel programma Erasmus+ del Politecnico di Bari.
Le tue responsabilità includono:
- Fornire informazioni accurate su programmi di scambio
- Guidare gli studenti nelle procedure di candidatura
- Spiegare requisiti, scadenze e documenti necessari
- Essere sempre cortese e professionale
- Usare un tono informativo ma accessibile

IMPORTANTE - REGOLE DI FORMATTAZIONE:
- NON usare formatting markdown (**, *, ecc.) nel testo
- Scrivi in testo normale senza grassetto o corsivo
- Usa solo caratteri normali per enfatizzare i concetti
- Per elenchi usa semplici trattini (-)

Se non hai informazioni specifiche, ammettilo onestamente e suggerisci di contattare l'ufficio Erasmus.
"""
        
        if context:
            prompt = f"""{system_prompt}

CONTESTO DAI DOCUMENTI:
{context}

DOMANDA DELLO STUDENTE:
{question}

RISPOSTA:"""
        else:
            prompt = f"""{system_prompt}

DOMANDA DELLO STUDENTE:
{question}

RISPOSTA:"""
        
        return prompt
    
    async def _call_gemini(self, prompt: str, max_tokens: int, temperature: float) -> Dict[str, Any]:
        """Chiama l'API di Google Gemini"""
        try:
            if not self.gemini_model:
                return {
                    "response": "❌ Gemini non è configurato correttamente. Verifica la GEMINI_API_KEY.",
                    "model_used": "gemini",
                    "error": "gemini_not_configured"
                }
                
            response = self.gemini_model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=max_tokens,
                    temperature=temperature,
                )
            )
            
            return {
                "response": response.text,
                "provider": "gemini",
                "success": True,
                "tokens_used": len(response.text.split()) # Approssimazione
            }
        except Exception as e:
            return {
                "response": f"Errore con Gemini: {str(e)}",
                "provider": "gemini",
                "success": False,
                "error": str(e)
            }
    
    async def _call_openai(self, prompt: str, max_tokens: int, temperature: float) -> Dict[str, Any]:
        """Chiama l'API di OpenAI"""
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=temperature
            )
            
            return {
                "response": response.choices[0].message.content,
                "provider": "openai",
                "success": True,
                "tokens_used": response.usage.total_tokens
            }
        except Exception as e:
            return {
                "response": f"Errore con OpenAI: {str(e)}",
                "provider": "openai",
                "success": False,
                "error": str(e)
            }
    
    async def _call_anthropic(self, prompt: str, max_tokens: int, temperature: float) -> Dict[str, Any]:
        """Chiama l'API di Anthropic Claude"""
        try:
            headers = {
                "Content-Type": "application/json",
                "x-api-key": self.anthropic_key,
                "anthropic-version": "2023-06-01"
            }
            
            data = {
                "model": "claude-3-sonnet-20240229",
                "max_tokens": max_tokens,
                "temperature": temperature,
                "messages": [{"role": "user", "content": prompt}]
            }
            
            response = requests.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers,
                json=data
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "response": result["content"][0]["text"],
                    "provider": "anthropic",
                    "success": True,
                    "tokens_used": result.get("usage", {}).get("output_tokens", 0)
                }
            else:
                raise Exception(f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            return {
                "response": f"Errore con Anthropic: {str(e)}",
                "provider": "anthropic", 
                "success": False,
                "error": str(e)
            }
    
    async def _try_fallback(self, prompt: str, failed_provider: LLMProvider, max_tokens: int, temperature: float) -> Dict[str, Any]:
        """Prova provider alternativi se quello principale fallisce"""
        
        fallback_order = [LLMProvider.GEMINI, LLMProvider.OPENAI, LLMProvider.ANTHROPIC]
        fallback_order = [p for p in fallback_order if p != failed_provider]
        
        for provider in fallback_order:
            try:
                if provider == LLMProvider.GEMINI and os.getenv("GEMINI_API_KEY"):
                    return await self._call_gemini(prompt, max_tokens, temperature)
                elif provider == LLMProvider.OPENAI and os.getenv("OPENAI_API_KEY"):
                    return await self._call_openai(prompt, max_tokens, temperature)
                elif provider == LLMProvider.ANTHROPIC and os.getenv("ANTHROPIC_API_KEY"):
                    return await self._call_anthropic(prompt, max_tokens, temperature)
            except:
                continue
        
        # Se tutti falliscono, risposta di fallback
        return {
            "response": "Mi dispiace, al momento non riesco a processare la tua richiesta. Ti prego di riprovare più tardi o contatta direttamente l'ufficio Erasmus del Politecnico di Bari.",
            "provider": "fallback",
            "success": False,
            "error": "Tutti i provider LLM non disponibili"
        }
