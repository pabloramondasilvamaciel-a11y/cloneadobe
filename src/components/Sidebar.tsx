import React from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar-default">
      <div className="sidebar-section">
        <h3>Informações do PDF</h3>
        <div className="info-group">
          <label>Nome do arquivo:</label>
          <span>Carregue um PDF para ver os detalhes</span>
        </div>
        <div className="info-group">
          <label>Páginas:</label>
          <span>-</span>
        </div>
        <div className="info-group">
          <label>Tamanho:</label>
          <span>-</span>
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Atalhos</h3>
        <ul className="shortcuts-list">
          <li><kbd>Ctrl</kbd> + <kbd>O</kbd> - Abrir PDF</li>
          <li><kbd>Ctrl</kbd> + <kbd>P</kbd> - Imprimir</li>
          <li><kbd>Ctrl</kbd> + <kbd>F</kbd> - Pesquisar</li>
          <li><kbd>+</kbd> - Zoom In</li>
          <li><kbd>−</kbd> - Zoom Out</li>
          <li><kbd>←</kbd> - Página Anterior</li>
          <li><kbd>→</kbd> - Próxima Página</li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3>Ajuda</h3>
        <p>
          Use a barra de ferramentas acima para navegar e anotar seu PDF. Clique em qualquer
          ferramenta para começar.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
