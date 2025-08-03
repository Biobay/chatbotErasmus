import { useState, useCallback } from 'react';
import type { Message, ChatState } from '../types/chat';

const MOCK_RESPONSES = [
  "Ciao! 👋 Sono il tuo assistente AI. Come posso aiutarti oggi?",
  "Interessante domanda! 🤔 Lasciami pensare... Ecco la mia risposta simulata con un'interfaccia molto più moderna!",
  "Fantastico! 🎉 Questa nuova interfaccia è molto più elegante e professionale, non trovi?",
  "Grazie per il tuo messaggio! 😊 Sto imparando sempre di più dalle nostre conversazioni. L'interfaccia ora ha un design molto più raffinato!",
  "Ottima domanda! 💡 In una vera implementazione, qui ci sarebbe una risposta dell'AI con tutti questi bei gradienti e animazioni.",
  "Mi piace molto questo nuovo stile! ✨ I messaggi ora hanno ombre, gradienti e animazioni fluide che rendono l'esperienza molto più piacevole.",
  "Perfetto! 🎯 Il sistema di chat ora ha un aspetto molto più professionale con il design glassmorphism e i colori moderni.",
  "Continua pure a scrivere! 💬 Ogni messaggio appare con belle animazioni e il layout è molto più curato rispetto a prima.",
  "Che bell'upgrade! 🚀 Dal semplice bianco siamo passati a gradienti, ombre e una vera esperienza utente di qualità.",
  "Eccellente! 🌟 Ora l'interfaccia è davvero degna di un'applicazione moderna con tutti gli effetti visivi del caso.",
];

export const useChat = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        content: 'Ciao! 🎉 Sono ChatBot Erasmus, il tuo nuovo assistente AI con interfaccia completamente ridisegnata! Come posso aiutarti oggi?',
        role: 'assistant',
        timestamp: new Date(),
      },
    ],
    isTyping: false,
  });

  const generateMockResponse = useCallback((): string => {
    return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
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

    // Simulate AI response delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateMockResponse(),
        role: 'assistant',
        timestamp: new Date(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isTyping: false,
      }));
    }, 1500 + Math.random() * 1000); // 1.5-2.5 seconds delay
  }, [generateMockResponse]);

  const clearChat = useCallback(() => {
    setChatState({
      messages: [
        {
          id: '1',
          content: 'Chat pulita! ✨ Sono ChatBot Erasmus, il tuo assistente AI con la nuova interfaccia moderna. Come posso aiutarti oggi?',
          role: 'assistant',
          timestamp: new Date(),
        },
      ],
      isTyping: false,
    });
  }, []);

  return {
    messages: chatState.messages,
    isTyping: chatState.isTyping,
    sendMessage,
    clearChat,
  };
};
