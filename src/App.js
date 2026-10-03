import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Components/Navbar";
import Gallery from "./Components/Gallery";
import "./App.css";

const BACKEND_URL = "https://wedding-backend-vvsy.onrender.com";

function App() {
  const [selectedEvent, setSelectedEvent] = useState("All");
  const [page, setPage] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [counts, setCounts] = useState({});

  // Security & Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("wedding_auth") === "true";
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [isRateLimited, setIsRateLimited] = useState(false);

  // Fire-and-forget health ping — warms up Render free-tier backend on first visit
  useEffect(() => {
    fetch(`${BACKEND_URL}/health`).catch(() => {});
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchCounts = async () => {
        try {
          const res = await axios.get(`${BACKEND_URL}/photos/counts`);
          setCounts(res.data);
        } catch (err) {
          console.error("Error fetching counts:", err);
        }
      };
      fetchCounts();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!inputPassword.trim()) return;

    setIsVerifying(true);
    setErrorMessage("");
    setIsError(false);

    try {
      const res = await axios.post(`${BACKEND_URL}/auth/verify`, {
        password: inputPassword,
      });

      if (res.data && res.data.valid) {
        sessionStorage.setItem("wedding_auth", "true");
        if (res.data.token) {
          sessionStorage.setItem("wedding_token", res.data.token);
        }
        setIsAuthenticated(true);
      } else {
        triggerError("Invalid password.");
      }
    } catch (err) {
      if (err.response && err.response.status === 429) {
        setIsRateLimited(true);
        setErrorMessage(
          err.response.data?.message ||
            "Too many failed attempts. Please try again in 15 minutes."
        );
      } else if (err.response && err.response.status === 401) {
        const remaining = Math.max(0, attemptsLeft - 1);
        setAttemptsLeft(remaining);
        triggerError(
          `Invalid password. ${remaining > 0 ? `${remaining} attempts remaining.` : "Please wait before retrying."}`
        );
      } else {
        triggerError("Unable to connect to server. Please try again.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const triggerError = (msg) => {
    setErrorMessage(msg);
    setIsError(true);
    setTimeout(() => setIsError(false), 600);
  };

  // 1. Loader View with Wedding Ring Heart Spinner
  if (isVerifying) {
    return (
      <div className="loader-container">
        <div className="spinner-wrapper">
          <div className="spinner"></div>
          <span className="heart-icon">💍</span>
        </div>
        <p>Verifying Secret Access...</p>
      </div>
    );
  }

  // 2. Password Protection View
  if (!isAuthenticated) {
    return (
      <div className="login-screen">
        <div className={`login-box ${isError ? "shake" : ""}`}>
          <span className="login-header-ring">💍</span>
          <h2>Geeta &amp; Sagar</h2>
          <p>Welcome to our Wedding Gallery. Please enter the password to unlock our memories.</p>

          {isRateLimited ? (
            <div className="auth-lockout-msg">
              🔒 {errorMessage}
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="auth-error-msg">
                  ⚠️ {errorMessage}
                </div>
              )}
              <form onSubmit={handleLogin}>
                <div className="password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Gallery Password"
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    disabled={isVerifying}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                <button type="submit" className="unlock-btn">
                  <span>Unlock Gallery</span>
                  <span>✨</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  // 3. Main Gallery View
  return (
    <div>
      <Navbar
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        setPage={setPage}
        setPhotos={setPhotos}
        counts={counts}
      />
      <Gallery
        selectedEvent={selectedEvent}
        page={page}
        setPage={setPage}
        photos={photos}
        setPhotos={setPhotos}
        counts={counts}
      />
    </div>
  );
}

export default App;