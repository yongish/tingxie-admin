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
import Exercise from "./components/Exercise";

function RequireAuth({ children }) {
  // try using localStorage here.


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
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route
              path="/exercise/:id"
              element={
                <RequireAuth>
                  <Exercise />
                </RequireAuth>
              }
            />
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;
