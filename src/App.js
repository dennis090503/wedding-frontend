import Gallery from "./Components/Gallery";
import Navbar from "./Components/Navbar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
function App() {
    const [selectedEvent, setSelectedEvent] = useState("All");
    const [page, setPage] = useState(1);
    const [photos, setPhotos] = useState([]);
    const [counts, setCounts] = useState({});

    // New States for Security and Loading
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [inputPassword, setInputPassword] = useState("");

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const res = await axios.get("https://wedding-backend-vvsy.onrender.com/photos/counts");
                setCounts(res.data);
            } catch (err) {
                console.error("Error fetching counts:", err);
            }
        };
        fetchCounts(); // Don't forget to call it!
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        setIsVerifying(true); // Start the loader

        // Simulate a small delay for the "loader" effect or wait for an API check
        setTimeout(() => {
            if (inputPassword === "geetawedssagar21022026") { // Set your password here
                setIsAuthenticated(true);
            } else {
                alert("Incorrect password!");
            }
            setIsVerifying(false); // Stop the loader
        }, 1000); 
    };

    // 1. Loader View
    if (isVerifying) {
        return (
            <div className="loader-container">
                <div className="spinner"></div>
                <p>Verifying Access...</p>
            </div>
        );
    }

    // 2. Password Page View
    if (!isAuthenticated) {
        return (
            <div className="login-screen">
                <div className="login-box">
                    <h2>Private Gallery</h2>
                    <p>Please enter the password to view the photos.</p>
                    <form onSubmit={handleLogin}>
                        <input 
                            type="password" 
                            placeholder="Password"
                            value={inputPassword}
                            onChange={(e) => setInputPassword(e.target.value)}
                        />
                        <button type="submit">Unlock</button>
                    </form>
                </div>
            </div>
        );
    }

    // 3. Main Gallery View (Only shows if authenticated)
    return (
        <div>
            <Navbar
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
                setPage={setPage}
                setPhotos={setPhotos}
            />
            <Gallery
                selectedEvent={selectedEvent}
                page={page}
                setPage={setPage}
                photos={photos}
                setPhotos={setPhotos}
            />
        </div>
    );
}

export default App;