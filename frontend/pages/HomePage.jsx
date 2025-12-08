import React, { useState, useEffect } from "react";
import { Zap, Shield, Menu, Plus, LogOut, Loader } from "lucide-react";
import { useAuth } from "../src/context/AuthContext";
import { useNavigate } from "react-router-dom";
import FileUpload from "../src/components/FileUpload";
import DocumentCard from "../src/components/DocumentCard";
import SearchBar from "../src/components/SearchBar";
import DocumentHistory from "../src/components/DocumentHistory";
import { getDocuments, searchDocuments, deleteDocument } from "../src/services/documentService";

const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  // Auto-refresh documents every 5 seconds if there's a processing document
  useEffect(() => {
    const hasProcessingDoc = documents.some(doc => doc.processingStatus === 'processing');
    if (hasProcessingDoc || isProcessing) {
      const interval = setInterval(() => {
        loadDocuments();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [documents, isProcessing]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await getDocuments(1, 20);
      if (response.success) {
        setDocuments(response.data.documents);
        // Check if any document is still processing
        const hasProcessing = response.data.documents.some(doc => doc.processingStatus === 'processing');
        setIsProcessing(hasProcessing);
      }
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (newDocument) => {
    setIsProcessing(true);
    // Reload documents to get the latest
    loadDocuments();
  };

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      setSearchMode(true);
      setSearchQuery(query);
      const response = await searchDocuments(query);
      if (response.success) {
        setDocuments(response.data.documents);
      }
    } catch (error) {
      console.error("Error searching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchMode(false);
    setSearchQuery("");
    loadDocuments();
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      await deleteDocument(documentId);
      setDocuments(documents.filter(doc => doc._id !== documentId));
      // Reload to ensure state is fresh
      loadDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document. Please try again.");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-600 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Sidebar */}
      <div 
        className={`relative z-10 bg-gray-900 bg-opacity-80 backdrop-blur-sm border-r border-yellow-500 border-opacity-20 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/50">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold text-yellow-400">DocNexus AI</span>
          </div>

          {/* New Document Button */}
          <button
            onClick={() => {
              setSelectedDocument(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full mb-6 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
          >
            <Plus className="w-5 h-5" />
            Upload Document
          </button>

          {/* Document History */}
          <DocumentHistory onDocumentClick={handleViewDocument} />

          {/* User Profile & Logout */}
          <div className="pt-4 border-t border-yellow-500 border-opacity-20 space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-black bg-opacity-40">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-yellow-400 truncate">
                  {user?.username || user?.email || 'User'}
                </div>
                <div className="text-xs text-yellow-500 text-opacity-50">Active</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-500 bg-opacity-20 text-red-400 rounded-lg hover:bg-opacity-30 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <div className="h-16 border-b border-yellow-500 border-opacity-20 flex items-center px-6 bg-gray-900 bg-opacity-60 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-yellow-500 hover:bg-opacity-10 rounded-lg transition-all"
          >
            <Menu className="w-5 h-5 text-yellow-400" />
          </button>
          <div className="flex-1 flex justify-center">
            <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
          </div>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {selectedDocument ? (
            // Document Detail View
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => setSelectedDocument(null)}
                className="mb-6 text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                ← Back to Documents
              </button>
              <div className="bg-gradient-to-br from-gray-800 to-black border-2 border-yellow-500 border-opacity-30 rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-yellow-400 mb-4">
                  {selectedDocument.originalName}
                </h1>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-yellow-400 mb-2">Executive Summary</h2>
                    <p className="text-yellow-100 text-opacity-70">{selectedDocument.executiveSummary}</p>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-yellow-400 mb-2">Full Summary</h2>
                    <p className="text-yellow-100 text-opacity-70 whitespace-pre-wrap">{selectedDocument.summary}</p>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-yellow-400 mb-2">Key Points</h2>
                    <p className="text-yellow-100 text-opacity-70 whitespace-pre-wrap">{selectedDocument.keyPoints}</p>
                  </div>
                  {selectedDocument.analysis && (
                    <div>
                      <h2 className="text-xl font-semibold text-yellow-400 mb-2">Analysis</h2>
                      <p className="text-yellow-100 text-opacity-70 whitespace-pre-wrap">{selectedDocument.analysis}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Document List View
            <div className="max-w-6xl mx-auto">
              {/* Upload Section */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
                  Upload & Analyze Documents
                </h2>
                {isProcessing && (
                  <div className="mb-4 p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg text-center">
                    <p className="text-yellow-400 font-semibold">
                      ⏳ Processing previous document... Please wait before uploading another.
                    </p>
                  </div>
                )}
                <FileUpload onUploadComplete={handleUploadComplete} disabled={isProcessing} />
              </div>

              {/* Documents Grid */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-yellow-400">
                    {searchMode ? `Search Results for "${searchQuery}"` : 'Your Documents'}
                  </h2>
                  <span className="text-yellow-500 text-opacity-50">
                    {documents.length} {documents.length === 1 ? 'document' : 'documents'}
                  </span>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader className="w-12 h-12 text-yellow-400 animate-spin" />
                  </div>
                ) : documents.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-yellow-500 text-opacity-50 text-lg">
                      {searchMode ? 'No documents found' : 'No documents yet. Upload your first document above!'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((doc) => (
                      <DocumentCard
                        key={doc._id}
                        document={doc}
                        onView={handleViewDocument}
                        onDelete={handleDeleteDocument}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;