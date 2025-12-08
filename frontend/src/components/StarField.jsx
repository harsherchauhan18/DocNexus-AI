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
      if (sizeRand < 0.7) {
        size = Math.random() * 1 + 0.5; // Small
      } else if (sizeRand < 0.9) {
        size = Math.random() * 2 + 1; // Medium
      } else {
        size = Math.random() * 3 + 1.5; // Large
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

    // Cleanup
    return () => {
      container.innerHTML = '';
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
      `}</style>
    </>
  );
};

export default StarField;
