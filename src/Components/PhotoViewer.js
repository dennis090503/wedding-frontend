import React from "react";
import "./Gallery.css"; // make sure CSS for .lightbox is included

function PhotoViewer({ photo, onClose }) {
  if (!photo) return null;

  const handleDownload = async () => {
  const response = await fetch(photo.url);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = photo.name || "photo.jpg";
  link.click();
  window.URL.revokeObjectURL(url);
};

  return (
    <div className="lightbox">
     
        <img src={photo.url} alt={photo.name} />
        <button className="download-btn" onClick={handleDownload}>Download</button>
        <button className="close-btn" onClick={onClose}>✕ Close</button>
    </div>
  );
}

export default PhotoViewer;