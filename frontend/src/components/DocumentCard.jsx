import React from 'react';
import { FileText, Calendar, Tag, Trash2, Eye, FileSearch } from 'lucide-react';

const DocumentCard = ({ document, onView, onDelete, onViewText }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getDocumentIcon = (type) => {
    return <FileText className="w-6 h-6" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'processing':
        return 'bg-yellow-500 animate-pulse';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-black border-2 border-yellow-500 border-opacity-30 rounded-2xl p-6 hover:border-opacity-60 hover:scale-[1.02] transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-yellow-500 bg-opacity-20 flex items-center justify-center text-yellow-400">
            {getDocumentIcon(document.documentType)}
          </div>
          <div className="flex-1">
            <h3 className="text-yellow-400 font-semibold truncate group-hover:text-yellow-300 transition-colors">
              {document.originalName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-3 h-3 text-yellow-500 text-opacity-50" />
              <span className="text-xs text-yellow-500 text-opacity-50">
                {formatDate(document.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className={`w-2 h-2 rounded-full ${getStatusColor(document.processingStatus)}`} />
      </div>

      {/* Document Type Badge */}
      {document.documentType && (
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-3 h-3 text-yellow-400" />
          <span className="text-xs px-2 py-1 bg-yellow-500 bg-opacity-20 text-yellow-400 rounded-full">
            {document.documentType}
          </span>
          {document.hasSensitiveData && (
            <span className="text-xs px-2 py-1 bg-red-500 bg-opacity-20 text-red-400 rounded-full">
              Sensitive Data
            </span>
          )}
        </div>
      )}

      {/* Summary Preview */}
      {document.processingStatus === 'processing' ? (
        <div className="mb-4 flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-yellow-400 font-semibold">Generating summary...</p>
        </div>
      ) : document.processingStatus === 'failed' ? (
        <div className="mb-4">
          <p className="text-sm text-red-400">Failed to process document</p>
        </div>
      ) : document.executiveSummary ? (
        <div className="mb-4">
          <p className="text-sm text-yellow-100 text-opacity-70 line-clamp-3">
            {document.executiveSummary}
          </p>
        </div>
      ) : null}

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-4 border-t border-yellow-500 border-opacity-20">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView && onView(document)}
            disabled={document.processingStatus === 'processing'}
            className={`flex-1 px-4 py-2 font-semibold rounded-lg flex items-center justify-center gap-2 transition-transform ${
              document.processingStatus === 'processing'
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:scale-[1.02]'
            }`}
          >
            <Eye className="w-4 h-4" />
            {document.processingStatus === 'processing' ? 'Processing...' : 'View Summary'}
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(document._id)}
              className="px-4 py-2 bg-red-500 bg-opacity-20 text-red-400 rounded-lg hover:bg-opacity-30 transition-all"
              title="Delete document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Extracted Text Button */}
        <button
          onClick={() => onViewText && onViewText(document)}
          disabled={document.processingStatus === 'processing'}
          className={`w-full px-4 py-2 font-semibold rounded-lg flex items-center justify-center gap-2 transition-transform ${
            document.processingStatus === 'processing'
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gray-700 bg-opacity-60 text-yellow-400 border border-yellow-500 border-opacity-30 hover:bg-opacity-80 hover:scale-[1.02]'
          }`}
        >
          <FileSearch className="w-4 h-4" />
          View Extracted Text
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
