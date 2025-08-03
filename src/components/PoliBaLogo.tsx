import React from 'react';

interface PoliBaLogoProps {
  size?: number;
  className?: string;
}

const PoliBaLogo: React.FC<PoliBaLogoProps> = ({ size = 96, className = "" }) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div 
      className={`relative bg-white rounded-full shadow-poliba-hard border-4 border-poliba-primary/20 flex items-center justify-center overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Logo del Politecnico di Bari */}
      {!imageError ? (
        <img 
          src="/logo.jpg" 
          alt="Politecnico di Bari Logo"
          className="object-contain"
          style={{ 
            width: size * 0.8, 
            height: size * 0.8,
            borderRadius: '50%'
          }}
          onError={() => {
            console.log('Errore nel caricamento del logo');
            setImageError(true);
          }}
          onLoad={() => console.log('Logo caricato con successo')}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-poliba-primary to-poliba-accent rounded-full">
          <span className="text-white font-bold" style={{ fontSize: size * 0.2 }}>
            PoliBA
          </span>
        </div>
      )}
      
      {/* Indicatore di stato */}
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-poliba-accent rounded-full flex items-center justify-center shadow-poliba-medium">
        <div className="w-3 h-3 bg-white rounded-full pulse-poliba"></div>
      </div>
    </div>
  );
};

export default PoliBaLogo;
