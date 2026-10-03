import React, { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import Masonry from "react-masonry-css";
import "./Gallery.css";

// Lazy load modals for performance optimization
const PhotoViewer = lazy(() => import("./PhotoViewer"));
const Slideshow = lazy(() => import("./Slideshow"));

const BACKEND_URL = "https://wedding-backend-vvsy.onrender.com";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  768: 2,
  500: 2,
};

function GalleryCard({ photo, index, onSelect }) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Cloudinary dynamic optimization: w_600 for high DPI crispness on grid cards
  const thumbUrl = photo.url
    ? photo.url.replace("/upload/", "/upload/w_600,q_auto,f_auto/")
    : "";

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = photo.name || `wedding-photo-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(photo.url, "_blank");
    }
  };

  return (
    <div
      className={`card ${isLoaded ? "loaded" : "loading"}`}
      onClick={() => onSelect(index)}
    >
      {!isLoaded && <div className="skeleton-loader"></div>}
      <img
        src={thumbUrl}
        alt={photo.name || `wedding-photo-${index + 1}`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={isLoaded ? "fade-in" : "hidden"}
      />
      <div className="overlay">
        <button
          className="download-btn"
          onClick={handleDownload}
          aria-label="Download photo"
        >
          ⬇ Download
        </button>
      </div>
    </div>
  );
}

function Gallery({ selectedEvent, page, setPage, photos, setPhotos, counts }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedEvent]);

  const fetchPhotos = async () => {
    setIsLoading(true);
    const url =
      selectedEvent === "All"
        ? `${BACKEND_URL}/photos?page=${page}`
        : `${BACKEND_URL}/photos?page=${page}&event=${selectedEvent}`;

    try {
      const res = await axios.get(url);
      setPhotos((prev) => {
        const newPhotos = res.data.filter(
          (newItem) => !prev.some((p) => p._id === newItem._id)
        );
        return [...prev, ...newPhotos];
      });
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPhoto = (index) => {
    setScrollPos(window.scrollY);
    setSelectedIndex(index);
  };

  const handleClosePhoto = () => {
    setSelectedIndex(null);
    window.scrollTo(0, scrollPos);
  };

  const totalPhotosInEvent = counts[selectedEvent] || 0;
  const hasMore = photos.length < totalPhotosInEvent;

  return (
    <div className="gallery-container">
      <header className="gallery-header">
        <h1 className="title">✨ Geeta &amp; Sagar ✨</h1>
        <p className="subtitle">Wedding Memories &amp; Celebrations</p>

        <div className="top-controls">
          <button
            className="slideshow-btn-top"
            onClick={() => setIsSlideshowActive(true)}
          >
            <span>🎬 Play Slideshow</span>
          </button>
        </div>
      </header>

      {/* React Masonry Grid - Zero Layout Shift on Append */}
      {photos.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {photos.map((photo, index) => (
            <GalleryCard
              key={photo._id || index}
              photo={photo}
              index={index}
              onSelect={handleOpenPhoto}
            />
          ))}
        </Masonry>
      ) : (
        !isLoading && (
          <div className="empty-state">
            <div className="empty-icon">💍</div>
            <h3>No Photos Yet</h3>
            <p>We haven't added photos to "{selectedEvent}" category yet. Check back soon!</p>
          </div>
        )
      )}

      {/* --- Pagination Section --- */}
      <div className="pagination-wrapper">
        {isLoading ? (
          <div className="loading-state">
            <div className="mini-ring-spinner"></div>
            <p className="loading-text">Loading memories...</p>
          </div>
        ) : hasMore ? (
          <button className="load-btn" onClick={() => setPage(page + 1)}>
            <span>Load More Photos</span>
            <span className="load-badge">({photos.length} / {totalPhotosInEvent})</span>
          </button>
        ) : (
          photos.length > 0 && (
            <div className="no-more-container">
              <p className="no-more-text">✨ You've reached the end of this collection ✨</p>
            </div>
          )
        )}
      </div>

      {/* Lazy loaded modals */}
      <Suspense fallback={null}>
        {selectedIndex !== null && (
          <PhotoViewer
            photos={photos}
            currentIndex={selectedIndex}
            setCurrentIndex={setSelectedIndex}
            onClose={handleClosePhoto}
          />
        )}
        {isSlideshowActive && (
          <Slideshow
            photos={photos}
            onClose={() => setIsSlideshowActive(false)}
          />
        )}
      </Suspense>

      {isSlideshowActive && (
        <audio autoPlay loop id="wedding-music">
          <source src="/wedding_song.mpeg" type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
}

export default Gallery;