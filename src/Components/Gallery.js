import { useEffect, useState } from "react";
import axios from "axios";
import "./Gallery.css";
import PhotoViewer from "./PhotoViewer";
import Slideshow from "./Slideshow"; 
function Gallery({ selectedEvent, page, setPage, photos, setPhotos, counts }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchPhotos();
  }, [page, selectedEvent]);

 const fetchPhotos = async () => {
      setIsLoading(true); // Start loading
      const url = selectedEvent === "All"
          ? `https://wedding-backend-vvsy.onrender.com/photos?page=${page}`
          : `https://wedding-backend-vvsy.onrender.com/photos?page=${page}&event=${selectedEvent}`;

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
        setIsLoading(false); // End loading
      }
  };
  // Open PhotoViewer
  const handleClickPhoto = (photo) => {
    setScrollPos(window.scrollY);
    setSelectedPhoto(photo);
  };

  // Close PhotoViewer
  const handleClose = () => {
    setSelectedPhoto(null);
    window.scrollTo(0, scrollPos);
  };

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || "wedding-photo.jpg";
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed", error);
      // Fallback: open in new tab if blob fails
      window.open(url, "_blank");
    }
  };

  // Determine if there are more photos to load based on the counts from backend
  const totalPhotosInEvent = counts[selectedEvent] || 0;
  const hasMore = photos.length < totalPhotosInEvent;

  return (
    <div className="gallery-container">
      <h1 className="title">💍 Wedding Memories</h1>
     <div className="top-controls">
      <button 
        className="slideshow-btn-top" 
        onClick={() => setIsSlideshowActive(true)}
      >
        🎬 Play Slideshow
      </button>
    </div>
      {/* Render the overlay when active */}
      {isSlideshowActive && (
        <Slideshow 
          photos={photos} 
          onClose={() => setIsSlideshowActive(false)} 
        />
      )}
      <div className="masonry">
        {photos.map((p, i) => {
          // Cloudinary dynamic optimization for thumbnails
          const thumb = p.url.replace("/upload/", "/upload/w_400,q_auto/");
          return (
            <div 
              className="card" 
              key={p._id || i} 
              onClick={() => handleClickPhoto(p)} 
              style={{ cursor: "pointer" }}
            >
              <img
                src={thumb}
                alt={p.name || `wedding-photo-${i}`}
                loading="lazy"
              />
              <div className="overlay">
                <button
                  className="download-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // Stops the PhotoViewer from opening
                    handleDownload(p.url, p.name);
                  }}
                >
                  ⬇ Download
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Pagination Section --- */}
     <div className="pagination-wrapper">
        {isLoading ? (
          <p className="loading-text">Loading your memories...</p> 
        ) : hasMore ? (
          <button className="load-btn" onClick={() => setPage(page + 1)}>
            Load More
          </button>
        ) : (
          photos.length > 0 && (
            <div className="no-more-container">
              <p className="no-more-text">✨ No more photos found ✨</p>
            </div>
          )
        )}
      </div>

      {/* Render PhotoViewer */}
      {selectedPhoto && (
        <PhotoViewer photo={selectedPhoto} onClose={handleClose} />
      )}
      {isSlideshowActive && (
      <audio autoPlay loop id="wedding-music">
        {/* Replace with your actual hosted mp3 or local file in /public */}
        <source src="/wedding_song.mpeg" type="audio/mpeg" />
      </audio>
    )}
    </div>
  );
}

export default Gallery;