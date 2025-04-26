import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorBoundary = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    },5000); 
  }, [navigate]);

  if (loading)
    return (
      <div className="center-container">
        <p className="center-message">🚧 Oups ! Route introuvable</p>
        <p className="center-description">La page que vous cherchez n'existe pas ou a été déplacée.</p>
        <p className="center-info">Nous vous redirigeons vers la page d'accueil dans quelques secondes...</p>
        <img
          src="/MAP2-300.png"
          alt="Chargement..."
          className="center-image"
        />
        <p className="center-info">Redirection automatique...</p>
        <button
          onClick={() => navigate('/')}
          className="btn fw-bold secondaryButton"
        >
          Retour à l'accueil
        </button>
      </div>
    );

  return null;
};

export default ErrorBoundary;
