import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import "./Slideshow.css";

const Slideshow = ({ photos, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);

  useEffect(() => {
    if (isPaused || !photos || photos.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [photos, isPaused]);

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
  };

  if (!photos || photos.length === 0) return null;

  const slideshowJSX = (
    <div
      className="slideshow-overlay"
      onClick={() => setIsPaused(!isPaused)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top progress bar indicator */}
      <div className="slideshow-progress-bar-container">
        <div
          key={currentIndex}
          className={`slideshow-progress-bar ${isPaused ? "paused" : ""}`}
        ></div>
      </div>

      <div className="slideshow-top-controls">
        <div className="slide-counter">
          {currentIndex + 1} / {photos.length} {isPaused && <span className="pause-badge">⏸ Paused</span>}
        </div>
        <button
          className="close-slideshow"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close Slideshow"
        >
          ✕ Close
        </button>
      </div>

      <button className="slideshow-nav-btn prev" onClick={handlePrev} aria-label="Previous Slide">
        ❮
      </button>

      <div className="slideshow-content">
        {photos.map((photo, index) => {
          const isVisible =
            Math.abs(index - currentIndex) <= 1 ||
            (index === 0 && currentIndex === photos.length - 1);
          if (!isVisible) return null;

          const photoOptimized = photo.url
            ? photo.url.replace("/upload/", "/upload/w_1600,q_auto,f_auto/")
            : "";

          return (
            <div
              key={photo._id || index}
              className={`slide ${index === currentIndex ? "active" : ""} ${
                isPaused ? "ken-burns-paused" : ""
              }`}
              style={{ backgroundImage: `url(${photoOptimized})` }}
            />
          );
        })}
      </div>

      <button className="slideshow-nav-btn next" onClick={handleNext} aria-label="Next Slide">
        ❯
      </button>
    </div>
  );

  return ReactDOM.createPortal(slideshowJSX, document.body);
};

export default Slideshow;