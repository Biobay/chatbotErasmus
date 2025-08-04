import os
import google.generativeai as genai
from dotenv import load_dotenv
import sys

def test_gemini_api():
    """
    Tests the Gemini API key by sending a simple prompt.
    """
    # Assumiamo che lo script sia eseguito dalla root della cartella 'backend'
    dotenv_path = '.env'
    load_dotenv(dotenv_path=dotenv_path)

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key or "your_gemini_api_key_here" in api_key:
        print("❌ Errore: GEMINI_API_KEY non trovata o non configurata nel file .env")
        sys.exit(1)

    print("🔑 Chiave API Gemini trovata. Configurazione del client...")

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-pro')
        print("✅ Client Gemini configurato con successo.")
        print("🤖 Invio di una richiesta di test a Gemini...")

        response = model.generate_content("Ciao Gemini, questo è un test. Rispondi 'OK' se mi ricevi.")

        if response.text:
            print(f"🎉 Risposta da Gemini: {response.text.strip()}")
            if "OK" in response.text.upper():
                print("✅ La chiave API di Gemini funziona correttamente!")
            else:
                print("⚠️ La risposta non era 'OK', ma la comunicazione ha funzionato.")
        else:
            print("❌ Errore: La risposta da Gemini è vuota. Potrebbe esserci un problema con la chiave o con i permessi.")
            print("Dettagli della risposta:", response)

    except Exception as e:
        print(f"❌ Si è verificato un errore grave durante la comunicazione con l'API di Gemini:")
        print(e)
        print("\nControlla i seguenti punti:")
        print("1. La chiave API è corretta, valida e non è scaduta.")
        print("2. Hai una connessione internet attiva.")
        print("3. L'API di Gemini (Generative Language API) è abilitata nel tuo progetto Google Cloud.")

if __name__ == "__main__":
    test_gemini_api()
