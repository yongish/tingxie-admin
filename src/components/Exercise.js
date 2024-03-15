import React, { useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import TextareaAutosize from "react-textarea-autosize";
import ImageTabs from "./ImageTabs";

const Exercise = () => {
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
        <BtnMarginBottom onClick={() => {}}>Save (unimplemented)</BtnMarginBottom>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ImageTabs />
        </div>
        <TextareaAutosize value="Hello World" cols={80} />
      </div>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </DivMargin>
  );
};

export default Exercise;

const DivMargin = styled.div`
  margin: 10px;
`;
const BtnMarginBottom = styled(Button)`
  margin-bottom: 10px;
`;
