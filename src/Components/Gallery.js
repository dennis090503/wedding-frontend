import { useEffect, useState } from "react";
import axios from "axios";
import "./Gallery.css";
import PhotoViewer from "./PhotoViewer"
function Gallery({ selectedEvent, page, setPage, photos, setPhotos }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    fetchPhotos();
  }, [page, selectedEvent]);

  const fetchPhotos = async () => {
    const url =
      selectedEvent === "All"
        ? `https://wedding-backend-vvsy.onrender.com/photos?page=${page}`
        : `https://wedding-backend-vvsy.onrender.com/photos?page=${page}&event=${selectedEvent}`;

    const res = await axios.get(url);

    setPhotos((prev) => {
      const newPhotos = res.data.filter(
        (newItem) => !prev.some((p) => p._id === newItem._id)
      );
      return [...prev, ...newPhotos];
    });
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
  return (
    <div className="gallery-container">
      <h1 className="title">💍 Wedding Memories</h1>
      <div className="masonry">
     {photos.map((p, i) => {
        const thumb = p.url.replace("/upload/", "/upload/w_400,q_auto/");
        return (
          <div className="card" key={i} onClick={() => handleClickPhoto(p)} style={{ cursor: "pointer" }}>
            <img
              src={thumb}
              alt={p.name}
              loading="lazy"
            />
            <div className="overlay">
            <button
              className="download-btn"
              onClick={(e) => {
                e.stopPropagation(); // Stops the PhotoViewer from opening
                handleDownload(p.url, p.name); // Use the new function above
              }}
            >
              ⬇ Download
            </button>
            </div>
          </div>
        );
      })}
      </div>

      <button className="load-btn" onClick={() => setPage(page + 1)}>
        Load More
      </button>

      {/* Render PhotoViewer */}
      {selectedPhoto && (
        <PhotoViewer photo={selectedPhoto} onClose={handleClose} />
      )}
    </div>
  );
}

export default Gallery;