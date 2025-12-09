import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, FileText, Brain, Shield, Search, Sparkles } from 'lucide-react';
import StarField from '../components/StarField';

const LandingPage = () => {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'Welcome to DocNexus-AI';
  const [currentIndex, setCurrentIndex] = useState(0);

  // Typewriter effect
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Document Upload',
      description: 'Upload and process various document formats including PDF, DOCX, and more'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI algorithms extract key insights and generate comprehensive summaries'
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Smart Search',
      description: 'Quickly find documents with intelligent semantic search capabilities'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Sensitive Data Detection',
      description: 'Automatically identify and flag documents containing sensitive information'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Executive Summaries',
      description: 'Get concise executive summaries and detailed key points extraction'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast',
      description: 'Process documents quickly with our optimized AI pipeline'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Starry Background */}
      <div className="absolute inset-0 opacity-80">
        <StarField dense={true} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <div className="text-center max-w-5xl mx-auto">
            {/* Logo */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-2xl shadow-yellow-500/50 animate-pulse">
                <Zap className="w-12 h-12 text-black" />
              </div>
            </div>

            {/* Typewriter Text */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              {displayedText}
              <span className="animate-pulse">|</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-yellow-100 text-opacity-70 mb-12 max-w-3xl mx-auto">
              Transform your documents into actionable insights with the power of AI. 
              Upload, analyze, and discover what matters most.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/login')}
              className="group relative px-12 py-5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-xl rounded-full hover:scale-105 transition-all duration-300 shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-400/70"
            >
              <span className="relative z-10 flex items-center gap-3">
                Get Started
                <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            </button>

            {/* Scroll Indicator */}
            <div className="mt-20 animate-bounce">
              <div className="w-6 h-10 border-2 border-yellow-400 rounded-full flex items-start justify-center p-2">
                <div className="w-1.5 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-yellow-100 text-opacity-70 text-center mb-16 max-w-2xl mx-auto">
              Everything you need to manage and analyze your documents efficiently
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-gray-800 to-black border-2 border-yellow-500 border-opacity-30 rounded-2xl p-8 hover:border-opacity-60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/30"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-lg shadow-yellow-500/50">
                    <div className="text-black">
                      {feature.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-yellow-100 text-opacity-70 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/0 to-yellow-500/0 group-hover:from-yellow-400/5 group-hover:to-yellow-500/5 transition-all duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-20">
              <p className="text-xl text-yellow-100 text-opacity-70 mb-6">
                Ready to revolutionize your document workflow?
              </p>
              <button
                onClick={() => navigate('/login')}
                className="group relative px-10 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-400/70"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Start Your Journey
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 py-8 border-t border-yellow-500 border-opacity-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-yellow-100 text-opacity-50">
              © 2024 DocNexus-AI. Powered by Advanced AI Technology.
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
