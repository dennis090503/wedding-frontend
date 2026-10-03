import React, { useRef, useEffect } from "react";
import "./Navbar.css";

const Navbar = ({ selectedEvent, setSelectedEvent, setPage, setPhotos, counts }) => {
  const events = [
    "All",
    "Katha",
    "Baherana",
    "Dikh",
    "Hast Melap",
    "Reception",
  ];

  const btnRefs = useRef({});

  useEffect(() => {
    if (btnRefs.current[selectedEvent]) {
      btnRefs.current[selectedEvent].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedEvent]);

  const handleClick = (event) => {
    if (selectedEvent === event) return;
    setSelectedEvent(event);
    setPage(1);
    setPhotos([]); // reset images
  };

  return (
    <div className="navbar-wrapper">
      <nav className="navbar-container">
        <div className="navbar-fade-left"></div>
        <div className="navbar">
          {events.map((event) => (
            <button
              key={event}
              ref={(el) => (btnRefs.current[event] = el)}
              className={selectedEvent === event ? "active" : ""}
              onClick={() => handleClick(event)}
              aria-label={`Filter by ${event}`}
            >
              <span className="event-name">{event}</span>
              {counts && counts[event] > 0 && (
                <span className="count-badge">{counts[event]}</span>
              )}
            </button>
          ))}
        </div>
        <div className="navbar-fade-right"></div>
      </nav>
    </div>
  );
};

export default Navbar;