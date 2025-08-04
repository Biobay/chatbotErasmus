import { useState, useCallback, useEffect } from 'react';
import type { Message, ChatState } from '../types/chat';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const useChat = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isTyping: false,
    sessionId: null,
  });

  // Messaggio di benvenuto iniziale
  useEffect(() => {
    setChatState({
      messages: [
        {
          id: '1',
          content: 'Ciao! 🎉 Sono ChatBot Erasmus, il tuo nuovo assistente AI. Come posso aiutarti oggi?',
          role: 'assistant',
          timestamp: new Date(),
        },
      ],
      isTyping: false,
      sessionId: null,
    });
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
    }));

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          session_id: chatState.sessionId,
          use_rag: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Errore API: ${response.statusText}`);
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
        sources: data.sources,
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isTyping: false,
        sessionId: data.session_id,
      }));

    } catch (error) {
      console.error("Dettaglio errore fetch:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Oops! Qualcosa è andato storto. Controlla la console del browser (F12) per i dettagli.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isTyping: false,
      }));
    }
  }, [chatState.sessionId]);

  const clearChat = useCallback(() => {
    setChatState({
      messages: [
        {
          id: '1',
          content: 'Chat pulita! ✨ Sono di nuovo pronto ad aiutarti con le tue domande su Erasmus.',
          role: 'assistant',
          timestamp: new Date(),
        },
      ],
      isTyping: false,
      sessionId: null, // Resetta anche la sessione
    });
  }, []);

  return {
    messages: chatState.messages,
    isTyping: chatState.isTyping,
    sendMessage,
    clearChat,
  };
};
