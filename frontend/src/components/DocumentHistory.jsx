import React, { useEffect, useState } from 'react';
import { FileText, Clock } from 'lucide-react';
import { getDocumentHistory } from '../services/documentService';

const DocumentHistory = ({ onDocumentClick }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await getDocumentHistory(20);
      if (response.success) {
        setHistory(response.data);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Refresh history when a new document is added
  useEffect(() => {
    const interval = setInterval(loadHistory, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="text-xs text-yellow-500 text-opacity-50 mb-2 font-semibold">
        RECENT DOCUMENTS
      </div>
      <div className="space-y-2">
        {history.length === 0 ? (
          <div className="text-center py-8 text-yellow-500 text-opacity-50 text-sm">
            No documents yet
          </div>
        ) : (
          history.map((doc) => (
            <div
              key={doc._id}
              onClick={() => onDocumentClick && onDocumentClick(doc)}
              className="p-3 rounded-lg bg-black bg-opacity-40 border border-yellow-500 border-opacity-20 cursor-pointer hover:bg-opacity-60 transition-all group"
            >
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-yellow-400 font-medium truncate group-hover:text-yellow-300">
                    {doc.originalName}
                  </div>
                  {doc.documentType && (
                    <div className="text-xs text-yellow-500 text-opacity-50 mt-0.5">
                      {doc.documentType}
                    </div>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-yellow-500 text-opacity-50" />
                    <div className="text-xs text-yellow-500 text-opacity-50">
                      {formatTime(doc.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DocumentHistory;
