import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the chat interface', () => {
    render(<App />);
    
    // Verifica che l'header sia presente
    expect(screen.getByText('ChatBot Erasmus')).toBeInTheDocument();
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    
    // Verifica che il messaggio di benvenuto sia presente
    expect(screen.getByText(/Ciao! Sono ChatBot Erasmus/)).toBeInTheDocument();
    
    // Verifica che l'input sia presente
    expect(screen.getByPlaceholderText('Scrivi il tuo messaggio...')).toBeInTheDocument();
  });
});
