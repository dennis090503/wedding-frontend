import React from "react";
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

  const handleClick = (event) => {
    setSelectedEvent(event);
    setPage(1);
    setPhotos([]); // reset images
  };

  return (
    <div className="navbar">
      {events.map((event) => (
        <button
          key={event}
          className={selectedEvent === event ? "active" : ""}
          onClick={() => handleClick(event)}
        >
          {event}
          {/* Only show badge if count exists and is greater than 0 */}
          {counts && counts[event] > 0 && (
            <span className="count-badge">{counts[event]}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default Navbar;