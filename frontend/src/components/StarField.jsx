import React, { useEffect, useRef } from 'react';

const StarField = ({ dense = false }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const starCount = dense ? 500 : 300;

    // Create stars
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.style.position = 'absolute';
      star.style.borderRadius = '50%';
      star.style.backgroundColor = 'white';
      
      // Random size
      const sizeRand = Math.random();
      let size;
      if (sizeRand < 0.6) {
        size = Math.random() * 1 + 0.5; // Small
      } else if (sizeRand < 0.85) {
        size = Math.random() * 2.5 + 1; // Medium
      } else {
        size = Math.random() * 4 + 2; // Large
      }
      
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random position
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Random opacity
      star.style.opacity = Math.random() * 0.5 + 0.5;
      
      // Add twinkle animation to some stars
      if (Math.random() > 0.7) {
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out`;
        star.style.animationDelay = `${Math.random() * 3}s`;
      }
      
      container.appendChild(star);
    }

    // Create shooting stars at intervals
    const createShootingStar = () => {
      const shootingStar = document.createElement('div');
      shootingStar.style.position = 'absolute';
      shootingStar.style.width = '150px';
      shootingStar.style.height = '3px';
      shootingStar.style.borderRadius = '50%';
      shootingStar.style.background = 'linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0))';
      shootingStar.style.boxShadow = '0 0 10px 3px rgba(255, 255, 255, 0.8), 0 0 20px 5px rgba(255, 255, 255, 0.5)';
      shootingStar.style.transformOrigin = 'left center';
      shootingStar.style.transform = 'rotate(-45deg)';
      
      // Random starting position (from top or right side)
      const startFromTop = Math.random() > 0.5;
      if (startFromTop) {
        shootingStar.style.left = `${Math.random() * 100}%`;
        shootingStar.style.top = '-10%';
      } else {
        shootingStar.style.left = '110%';
        shootingStar.style.top = `${Math.random() * 50}%`;
      }
      
      shootingStar.style.animation = 'shootingStar 1.5s linear forwards';
      
      container.appendChild(shootingStar);
      
      // Remove after animation completes
      setTimeout(() => {
        if (container.contains(shootingStar)) {
          container.removeChild(shootingStar);
        }
      }, 1500);
    };

    const shootingStarInterval = setInterval(createShootingStar, 2000);

    // Cleanup
    return () => {
      container.innerHTML = '';
      clearInterval(shootingStarInterval);
    };
  }, [dense]);

  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes shootingStar {
          0% {
            transform: translate(0, 0) rotate(-45deg);
            opacity: 1;
          }
          100% {
            transform: translate(-400px, 400px) rotate(-45deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default StarField;