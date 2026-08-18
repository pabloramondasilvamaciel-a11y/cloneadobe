import React, { useState } from 'react';
import './PasswordDialog.css';

interface PasswordDialogProps {
  onSubmit: (password: string) => void;
  onCancel: () => void;
}

const PasswordDialog: React.FC<PasswordDialogProps> = ({ onSubmit, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!password.trim()) {
      setError('Digite uma senha');
      return;
    }
    onSubmit(password);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="password-dialog-overlay">
      <div className="password-dialog">
        <div className="dialog-header">
          <h2>🔒 Documento Protegido</h2>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <div className="dialog-content">
          <p>Este documento está protegido por senha. Digite a senha para continuar.</p>

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            onKeyDown={handleKeyDown}
            placeholder="Digite a senha..."
            autoFocus
            className="password-input"
          />

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="dialog-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Cancelar
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            Desbloquear
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordDialog;
