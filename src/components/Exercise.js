import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import TextareaAutosize from "react-textarea-autosize";
import ImageTabs from "./ImageTabs";
import { getHost } from "./utils/env";

const Exercise = () => {
  // const {
  //   state: { id },
  // } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [exerciseData, setExerciseData] = useState({});
  const {
    source,
    sourceUrl,
    pageNumber,
    rawString,
    exerciseType,
    createdAt,
    pageUrl,
    secondLastPageUrl,
    lastPageUrl,
    lastEditedBy,
    lastEditedAt,
  } = exerciseData;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // const uid = user.uid;
        // ...
        // console.log("uid", uid);
      } else {
        navigate("/login");
      }
    });
  }, [navigate]);

  useEffect(() => {
    // Load original page here.
    // todo: get exercise string
    fetch(`${getHost()}exercise-data/${id}`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        setExerciseData(data)
      });
  }, [id]);

  return (
    <DivMargin>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <ImageTabs
            pageUrl={pageUrl}
            secondLastPageUrl={secondLastPageUrl}
            lastPageUrl={lastPageUrl}
          />
        </div>
        <div>
          <TextareaAutosize
            value={rawString}
            onChange={(e) =>
              setExerciseData({ ...exerciseData, rawString: e.data })
            }
            cols={80}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button onClick={() => navigate("/")} variant="secondary">
              Cancel (Go Back)
            </Button>
            <Button onClick={() => {}}>Save (unimplemented)</Button>
          </div>
        </div>
      </div>
    </DivMargin>
  );
};

export default Exercise;

const DivMargin = styled.div`
  margin: 10px;
`;
