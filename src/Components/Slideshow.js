import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM
import "./Slideshow.css";

const Slideshow = ({ photos, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [photos.length]);

  // The Portal logic
  const slideshowJSX = (
    <div className="slideshow-overlay">
      <button className="close-slideshow" onClick={onClose}>✕ Close</button>
      
      <div className="slideshow-content">
        {photos.map((photo, index) => {
          const isVisible = Math.abs(index - currentIndex) <= 1;
          if (!isVisible) return null;
          
          return (
            <div
              key={photo._id || index}
              className={`slide ${index === currentIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${photo.url})` }}
            />
          );
        })}
      </div>
    </div>
  );

  // Renders the component into the <body> instead of inside the Gallery div
  return ReactDOM.createPortal(slideshowJSX, document.body);
};

export default Slideshow;