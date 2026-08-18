import React, { useState } from 'react';
import { pdfUtil } from '@utils/pdfUtils';
import './SearchPanel.css';

const SearchPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Array<{ page: number; text: string; matches: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [matchCase, setMatchCase] = useState(false);
  const [selectedResult, setSelectedResult] = useState<number | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const searchResults = await pdfUtil.searchText(searchQuery, { matchCase });
      setResults(searchResults);
      setSelectedResult(null);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = () => {
    // Navigate to page and highlight
    // This would dispatch to the PDF store
  };

  return (
    <div className="search-panel">
      <div className="search-input-group">
        <input
          type="text"
          placeholder="Pesquisar no PDF..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn" disabled={loading}>
          {loading ? '⟳' : '🔍'}
        </button>
      </div>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={matchCase}
          onChange={(e) => setMatchCase(e.target.checked)}
        />
        Diferenciar maiúsculas
      </label>

      <div className="search-results">
        <div className="results-header">
          <span>{results.length} resultado(s) encontrado(s)</span>
        </div>

        {results.length === 0 ? (
          <div className="no-results">
            {searchQuery ? 'Nenhum resultado encontrado' : 'Digite algo para pesquisar'}
          </div>
        ) : (
          <ul className="results-list">
            {results.map((result, index) => (
              <li
                key={index}
                className={`result-item ${selectedResult === index ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedResult(index);
                  handleResultClick();
                }}
              >
                <div className="result-page">Página {result.page}</div>
                <div className="result-text">{result.text}</div>
                <div className="result-matches">
                  {result.matches} {result.matches === 1 ? 'ocorrência' : 'ocorrências'}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;
