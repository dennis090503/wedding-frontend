import React, { useState, useEffect, useRef, useCallback } from "react";
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

  // Desktop: active button scroll ref
  const btnRefs = useRef({});
  // Mobile: expand/collapse state
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Auto-scroll active button into view on desktop
  useEffect(() => {
    if (btnRefs.current[selectedEvent]) {
      btnRefs.current[selectedEvent].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedEvent]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = useCallback(
    (event) => {
      if (selectedEvent !== event) {
        setSelectedEvent(event);
        setPage(1);
        setPhotos([]);
      }
      setIsOpen(false); // always close mobile menu on selection
    },
    [selectedEvent, setSelectedEvent, setPage, setPhotos]
  );

  const totalCount = counts?.["All"] || 0;

  return (
    <div className="navbar-wrapper" ref={menuRef}>
      {/* === DESKTOP: Horizontal pill nav === */}
      <nav className="navbar-desktop" aria-label="Gallery filter navigation">
        <div className="navbar-fade-left" aria-hidden="true"></div>
        <div className="navbar">
          {events.map((event) => (
            <button
              key={event}
              ref={(el) => (btnRefs.current[event] = el)}
              className={selectedEvent === event ? "active" : ""}
              onClick={() => handleClick(event)}
              aria-label={`Filter by ${event}`}
              aria-pressed={selectedEvent === event}
            >
              <span className="event-name">{event}</span>
              {counts && counts[event] > 0 && (
                <span className="count-badge">{counts[event]}</span>
              )}
            </button>
          ))}
        </div>
        <div className="navbar-fade-right" aria-hidden="true"></div>
      </nav>

      {/* === MOBILE: Collapsible dropdown === */}
      <div
        className="navbar-mobile"
        aria-label="Gallery filter navigation"
      >
        {/* Compact trigger bar */}
        <button
          className="mobile-trigger"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={`Currently filtering: ${selectedEvent}. Tap to ${isOpen ? "collapse" : "expand"} filter options`}
        >
          <div className="mobile-trigger-left">
            <span className="mobile-selected-pill">
              {selectedEvent}
              {counts && counts[selectedEvent] > 0 && (
                <span className="count-badge active-badge">
                  {counts[selectedEvent]}
                </span>
              )}
            </span>
          </div>
          <div className="mobile-trigger-right">
            {totalCount > 0 && (
              <span className="total-count-hint">{totalCount} photos</span>
            )}
            <span
              className={`chevron-icon ${isOpen ? "open" : ""}`}
              aria-hidden="true"
            >
              ▼
            </span>
          </div>
        </button>

        {/* Expanded dropdown menu */}
        <div
          id="mobile-menu"
          className={`mobile-menu ${isOpen ? "open" : ""}`}
          role="menu"
          aria-hidden={!isOpen}
        >
          {events.map((event) => (
            <button
              key={event}
              className={`mobile-menu-item ${selectedEvent === event ? "active" : ""}`}
              onClick={() => handleClick(event)}
              role="menuitem"
              aria-label={`Filter by ${event}`}
              tabIndex={isOpen ? 0 : -1}
            >
              <span className="mobile-event-name">{event}</span>
              {counts && counts[event] > 0 && (
                <span className={`count-badge ${selectedEvent === event ? "active-badge" : ""}`}>
                  {counts[event]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;