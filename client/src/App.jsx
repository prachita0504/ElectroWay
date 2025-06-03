import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Login from "./user/Login";
import Signup from "./user/Signup";
import Dashboard from "./Dashboard/Dashboard";
import Navbar from "./Dashboard/Navbar";
import Listing from "./Dashboard/listing";
import SavedStation from "./Dashboard/SavedStation";


function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login></Login>} />
        <Route path="/signup" element={<Signup></Signup>} />
        <Route path="/Dashboard" element={<Dashboard></Dashboard>} />
        <Route path="/Navbar" element={<Navbar></Navbar>} />
        <Route path="/listing" element={<Listing></Listing>} />
        <Route path="/SavedStation" element={<SavedStation></SavedStation>} />
      </Routes>
    </Router>
  );
}

export default App;
