import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { pdfjs, Document, Page } from "react-pdf";
import TextareaAutosize from "react-textarea-autosize";
import styled from "styled-components";

import { auth } from "./firebase";
import { getHost } from "./utils/env";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Exercise = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [exerciseData, setExerciseData] = useState({});
  const { sourceUrl, rawString, questionPageNumber, answerPageNumber } =
    exerciseData;
  const [activeKey, setActiveKey] = useState("questionPageNumber");

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
    fetch(`${getHost()}exercise-data/${id}`, {
      headers: { Authorization: `${location.state.token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setExerciseData(data);
      });
  }, [id]);

  const putExercise = () => {
    var local = new Date();
    var lastEditedAt = local.toISOString();

    fetch(`${getHost()}exercise-data`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${location.state.token}`,
      },
      body: JSON.stringify({
        ...exerciseData,
        lastEditedBy: auth.currentUser.email,
        lastEditedAt,
      }),
    })
      .then(() => navigate("/"))
      .catch((error) => console.error(error));
  };

  return (
    <DivMargin>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Document file={sourceUrl} style={{ border: "1px solid black" }}>
            <Tabs
              defaultActiveKey="questionPageNumber"
              className="mb-3"
              onSelect={(key) => setActiveKey(key)}
            >
              <Tab eventKey="questionPageNumber" title="Question Page">
                <div>
                  <Page
                    pageNumber={questionPageNumber}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </div>
              </Tab>
              <Tab eventKey="answerPageNumber" title="Answer Page">
                <div>
                  <Page
                    pageNumber={answerPageNumber}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </div>
              </Tab>
            </Tabs>
          </Document>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            <BtnMargin
              onClick={() => {
                setExerciseData((prevData) => ({
                  ...prevData,
                  [activeKey]: prevData[activeKey] - 1,
                }));
              }}
            >
              Previous Page
            </BtnMargin>
            <BtnMargin
              onClick={() =>
                setExerciseData((prevData) => {
                  return {
                    ...prevData,
                    [activeKey]: prevData[activeKey] + 1,
                  };
                })
              }
            >
              Next Page
            </BtnMargin>
          </div>
          <div>
            <TextareaAutosize
              value={rawString}
              onChange={(e) =>
                setExerciseData({ ...exerciseData, rawString: e.target.value })
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
              <Button
                onClick={() => {
                  putExercise();
                }}
              >
                Save
              </Button>
            </div>
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
const BtnMargin = styled(Button)`
  margin: 5px;
`;
