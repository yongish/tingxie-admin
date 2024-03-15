import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <div>
        <section>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <PrivateRoute>
              <Route path="/" element={<Home />} />
            </PrivateRoute> */}
            <Route path="/login" element={<Login />} />
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;
