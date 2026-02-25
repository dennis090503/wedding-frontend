import React, { useState, useEffect } from 'react';
import "./Slideshow.css";

const Slideshow = ({ photos, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [photos.length]);

  return (
    <div className="slideshow-overlay">
      <button className="close-slideshow" onClick={onClose}>✕ Close</button>
      
      <div className="slideshow-content">
        {photos.map((photo, index) => (
          <div
            key={photo._id}
            className={`slide ${index === currentIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${photo.url})` }}
          />
        ))}
      </div>
      
      <div className="slideshow-footer">
        <p>{photos[currentIndex]?.name || "Wedding Memories"}</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((currentIndex + 1) / photos.length) * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default Slideshow;