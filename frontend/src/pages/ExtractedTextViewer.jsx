import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { getDocumentById } from '../services/documentService';

const ExtractedTextViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedText, setHighlightedText] = useState('');
  const [currentMatch, setCurrentMatch] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);

  useEffect(() => {
    loadDocument();
  }, [id]);

  useEffect(() => {
    if (document?.rawText) {
      highlightMatches();
    }
  }, [searchQuery, document]);

  const loadDocument = async () => {
    try {
      const response = await getDocumentById(id);
      if (response.success) {
        setDocument(response.data);
        setHighlightedText(response.data.rawText || 'No text extracted');
      }
    } catch (error) {
      console.error('Error loading document:', error);
    } finally {
      setLoading(false);
    }
  };

  const highlightMatches = () => {
    if (!searchQuery.trim() || !document?.rawText) {
      setHighlightedText(document?.rawText || '');
      setTotalMatches(0);
      setCurrentMatch(0);
      return;
    }

    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const matches = document.rawText.match(regex);
    setTotalMatches(matches ? matches.length : 0);
    setCurrentMatch(matches ? 1 : 0);

    let matchIndex = 0;
    const highlighted = document.rawText.replace(regex, (match) => {
      matchIndex++;
      return `<mark class="${matchIndex === 1 ? 'bg-yellow-400 text-black' : 'bg-yellow-200 text-black'}" data-match="${matchIndex}">${match}</mark>`;
    });

    setHighlightedText(highlighted);
  };

  const navigateMatch = (direction) => {
    if (totalMatches === 0) return;

    let newMatch = currentMatch + direction;
    if (newMatch < 1) newMatch = totalMatches;
    if (newMatch > totalMatches) newMatch = 1;

    setCurrentMatch(newMatch);

    // Update highlighting
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    let matchIndex = 0;
    const highlighted = document.rawText.replace(regex, (match) => {
      matchIndex++;
      return `<mark class="${matchIndex === newMatch ? 'bg-yellow-400 text-black' : 'bg-yellow-200 text-black'}" data-match="${matchIndex}">${match}</mark>`;
    });

    setHighlightedText(highlighted);

    // Scroll to current match
    setTimeout(() => {
      const element = document.querySelector(`[data-match="${newMatch}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setHighlightedText(document?.rawText || '');
    setTotalMatches(0);
    setCurrentMatch(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Documents
          </button>
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">
            {document?.originalName}
          </h1>
          <p className="text-yellow-500 text-opacity-70">Extracted Text</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 bg-gray-900 border border-yellow-500 border-opacity-30 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in text..."
                className="w-full pl-12 pr-12 py-3 bg-black bg-opacity-60 rounded-xl text-white border-2 border-yellow-500 border-opacity-30 focus:border-yellow-500 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-500 hover:text-yellow-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {totalMatches > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-yellow-400 text-sm whitespace-nowrap">
                  {currentMatch} of {totalMatches}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigateMatch(-1)}
                    className="p-2 bg-yellow-500 bg-opacity-20 text-yellow-400 rounded-lg hover:bg-opacity-30 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigateMatch(1)}
                    className="p-2 bg-yellow-500 bg-opacity-20 text-yellow-400 rounded-lg hover:bg-opacity-30 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Text Content */}
        <div className="bg-gradient-to-br from-gray-800 to-black border-2 border-yellow-500 border-opacity-30 rounded-2xl p-8">
          <div
            className="text-yellow-100 text-opacity-90 whitespace-pre-wrap leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlightedText }}
          />
        </div>
      </div>
    </div>
  );
};

export default ExtractedTextViewer;
