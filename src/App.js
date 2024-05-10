import React from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Exercise from "./components/exercise/Exercise";
import { useAuth } from "./useAuth";

function RequireAuth({ children }) {
  const {
    pending,
    isSignedIn,
    auth,
    // user
  } = useAuth();

  if (pending) {
    return <h1>waiting...</h1>;
  }
  if (!isSignedIn) {
    return <Login />;
  }
  return children;
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
