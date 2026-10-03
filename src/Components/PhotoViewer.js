import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./Gallery.css";

function PhotoViewer({ photos, currentIndex, setCurrentIndex, onClose }) {
  const touchStartX = useRef(0);

  const currentPhoto = photos && photos[currentIndex] ? photos[currentIndex] : null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, photos]);

  if (!currentPhoto) return null;

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(photos.length - 1);
    }
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
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

  const handleDownload = async (e) => {
    if (e) e.stopPropagation();
    try {
      const response = await fetch(currentPhoto.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = currentPhoto.name || `wedding-photo-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      window.open(currentPhoto.url, "_blank");
    }
  };

  const highResUrl = currentPhoto.url
    ? currentPhoto.url.replace("/upload/", "/upload/w_1600,q_auto,f_auto/")
    : "";

  const lightboxJSX = (
    <div
      className="lightbox"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="lightbox-top-bar">
        <span className="lightbox-counter">
          {currentIndex + 1} / {photos.length}
        </span>
        <button
          className="close-btn"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close photo viewer"
        >
          ✕
        </button>
      </div>

      <button
        className="lightbox-nav-btn prev"
        onClick={handlePrev}
        aria-label="Previous photo"
      >
        ❮
      </button>

      <div className="lightbox-image-container" onClick={(e) => e.stopPropagation()}>
        <img
          src={highResUrl}
          alt={currentPhoto.name || `Wedding Photo ${currentIndex + 1}`}
        />
        <div className="lightbox-action-bar">
          <button className="download-btn" onClick={handleDownload}>
            <span>⬇ Download Photo</span>
          </button>
        </div>
      </div>

      <button
        className="lightbox-nav-btn next"
        onClick={handleNext}
        aria-label="Next photo"
      >
        ❯
      </button>
    </div>
  );

  return ReactDOM.createPortal(lightboxJSX, document.body);
}

export default PhotoViewer;