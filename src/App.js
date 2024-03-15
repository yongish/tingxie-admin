import React from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "./components/firebase";

import "./App.css";

function RequireAuth({ children }) {
  if (auth.currentUser) {
    return children;
  }
  return <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <div>
        <section>
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;
