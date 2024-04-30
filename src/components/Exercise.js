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
import { Alert, Form, Spinner } from "react-bootstrap";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Exercise = () => {
  const { id } = useParams();
  const location = useLocation();
  const token = location.state.token;
  const navigate = useNavigate();

  const [exerciseData, setExerciseData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeKey, setActiveKey] = useState("questionPageNumber");
  const [showDangerAlert, setShowDangerAlert] = useState(false);

  const {
    sourceUrl,
    rawString,
    questionPageNumber,
    answerPageNumber,
    invalid,
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
    fetch(`${getHost()}exercise-data/${id}`, {
      headers: { Authorization: `${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setExerciseData(data);
      });
  }, [id, token]);

  const putExercise = (isDraft) => {
    setIsLoading(true);

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
        isDraft,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          navigate("/", { state: { token } });
        } else {
          putInvalid(true);
          setShowDangerAlert(true);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  const putInvalid = async (invalid) => {
    const response = await fetch(
      `${getHost()}exercise-data/${id}/invalid/${invalid}`,
      {
        method: "PUT",
      }
    );
    if (response.status === 200) {
      setExerciseData({ ...exerciseData, invalid });
    } else {
      setShowDangerAlert(true);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Spinner />
      </div>
    );
  }
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
              <Tab eventKey="questionPageNumber" title="问题页">
                <div>
                  <Page
                    pageNumber={questionPageNumber}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </div>
              </Tab>
              <Tab eventKey="answerPageNumber" title="答案页">
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <BtnMargin
                onClick={() => {
                  setExerciseData((prevData) => ({
                    ...prevData,
                    [activeKey]: prevData[activeKey] - 1,
                  }));
                }}
              >
                上一页
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
                下一页
              </BtnMargin>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {showDangerAlert && (
                <Alert variant="danger" style={{ marginRight: 10 }}>
                  错误。 联络志勇。此练习已被标记为有错误。
                </Alert>
              )}
              <Form.Check
                type="checkbox"
                label="有错误"
                checked={invalid}
                onChange={(e) => putInvalid(e.target.checked)}
              />
            </div>
          </div>
          <div>
            <TextareaAutosize
              autoFocus
              onFocus={(e) => {
                setTimeout(() => (e.target.selectionEnd = 0), 0);
              }}
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
              <div>
                <Button
                  onClick={() => navigate("/", { state: { token } })}
                  variant="secondary"
                >
                  取消（返回首页）
                </Button>
                <Button
                  onClick={() => {
                    putExercise(true);
                  }}
                  style={{ marginLeft: "5px" }}
                >
                  保存草稿
                </Button>
              </div>
              <Button
                onClick={() => {
                  putExercise(false);
                }}
              >
                发布
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
