import React, { useState } from 'react';
import { usePDFStore } from '@store/pdfStore';
import './BookmarksPanel.css';

interface Bookmark {
  id: string;
  page: number;
  title: string;
  createdAt: Date;
}

const BookmarksPanel: React.FC = () => {
  const { viewState, setCurrentPage, document: pdfDocument } = usePDFStore();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(
    JSON.parse(localStorage.getItem('pdf-bookmarks') || '[]')
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const saveBookmarks = (newBookmarks: Bookmark[]) => {
    setBookmarks(newBookmarks);
    localStorage.setItem('pdf-bookmarks', JSON.stringify(newBookmarks));
  };

  const handleAddBookmark = () => {
    if (!pdfDocument) return;

    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      page: viewState.currentPage,
      title: `Página ${viewState.currentPage}`,
      createdAt: new Date()
    };

    saveBookmarks([...bookmarks, newBookmark]);
  };

  const handleDeleteBookmark = (id: string) => {
    saveBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  const handleEditBookmark = (id: string, oldTitle: string) => {
    setEditingId(id);
    setEditingTitle(oldTitle);
  };

  const handleSaveEdit = (id: string) => {
    saveBookmarks(
      bookmarks.map((b) =>
        b.id === id ? { ...b, title: editingTitle } : b
      )
    );
    setEditingId(null);
    setEditingTitle('');
  };

  const handleGoToBookmark = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bookmarks-panel">
      <div className="bookmarks-header">
        <button className="add-bookmark-btn" onClick={handleAddBookmark}>
          ➕ Adicionar
        </button>
      </div>

      <div className="bookmarks-list">
        {bookmarks.length === 0 ? (
          <div className="no-bookmarks">Nenhum marcador adicionado</div>
        ) : (
          <ul>
            {bookmarks.map((bookmark) => (
              <li
                key={bookmark.id}
                className={`bookmark-item ${viewState.currentPage === bookmark.page ? 'active' : ''}`}
              >
                {editingId === bookmark.id ? (
                  <div className="bookmark-edit">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      autoFocus
                      className="bookmark-edit-input"
                    />
                    <button
                      onClick={() => handleSaveEdit(bookmark.id)}
                      className="save-btn"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="cancel-btn"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      className="bookmark-content"
                      onClick={() => handleGoToBookmark(bookmark.page)}
                    >
                      <div className="bookmark-title">{bookmark.title}</div>
                      <div className="bookmark-page">Página {bookmark.page}</div>
                    </div>
                    <div className="bookmark-actions">
                      <button
                        onClick={() => handleEditBookmark(bookmark.id, bookmark.title)}
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDeleteBookmark(bookmark.id)}
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BookmarksPanel;
