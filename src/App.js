import Gallery from "./Components/Gallery";
import Navbar from "./Components/Navbar";
import React, { useState,useEffect } from "react";
import axios from "axios";

function App() {
    const [selectedEvent, setSelectedEvent] = useState("All");
    const [page, setPage] = useState(1);
    const [photos, setPhotos] = useState([]);
    const [counts, setCounts] = useState({});

useEffect(() => {
 const fetchCounts = async () => {
  try {
    const res = await axios.get("https://wedding-backend-0x8t.onrender.com/photos/counts");
    setCounts(res.data);
  } catch (err) {
    console.error("Error fetching counts:", err);
  }
};
}, []); // Runs once on load
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