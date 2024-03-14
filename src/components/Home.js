import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import styled from "styled-components";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
        console.log("uid", uid);
      } else {
        navigate("/login");
      }
    });
  }, [navigate]);

  useEffect(() => {
    // Load original page here.
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/login");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <DivMargin>
      <p>Welcome Home</p>
      <div>
        <Button onClick={() => {}}>Save (unimplemented)</Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={
            "https://gitlab.com/yongish/question-parsing/-/raw/main/gray.png"
          }
          width={750}
          alt=""
        />
        <TextareaAutosize value="Hello World" cols={80} />
      </div>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>

    </DivMargin>
  );
};

export default Home;

const DivMargin = styled.div`
  margin: 10px;
`;
const BtnMarginBottom = styled.button`
  margin-bottom: 10px;
`;
