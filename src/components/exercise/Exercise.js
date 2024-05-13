import React, { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { pdfjs, Document, Page } from "react-pdf";
import TextareaAutosize from "react-textarea-autosize";
import styled from "styled-components";
import Errors from "./Errors";
import { auth } from "../firebase";
import { getHost } from "../utils/env";
import { Alert, Form, Spinner } from "react-bootstrap";
import SearchResult from "./SearchResult";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Exercise = () => {
  const { id } = useParams();
  const location = useLocation();
  const token = location.state.token;
  const exerciseIds = location.state.exerciseIds;
  const navigate = useNavigate();

  const [exerciseData, setExerciseData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeKey, setActiveKey] = useState("questionPageNumber");
  const [showDangerAlert, setShowDangerAlert] = useState(false);
  const [showSavedAlert, setShowSavedAlert] = useState(false);
  const [query, setQuery] = useState("");

  const myRef = useRef(null);

  const {
    sourceUrl,
    rawString,
    questionPageNumber,
    answerPageNumber,
    // invalid,
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
    fetch(`${getHost()}exercise-data/${id}`, {
      headers: { Authorization: `${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        setExerciseData(data);
      });
  }, [id, token]);

  const putExercise = (exerciseData) => {
    setIsLoading(true);
    setShowDangerAlert(false);
    setShowSavedAlert(false);

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
      .then((response) => {
        if (response.status === 200) {
          setShowDangerAlert(false);
          setShowSavedAlert(true);
          setExerciseData(exerciseData);
        } else {
          setShowDangerAlert(true);
          setShowSavedAlert(false);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
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

  const currExerciseIndex = exerciseIds.indexOf(parseInt(id));
  const prevExerciseId =
    currExerciseIndex === 0 ? -1 : exerciseIds[currExerciseIndex - 1];
  const nextExerciseId =
    currExerciseIndex === exerciseIds.length - 1
      ? -1
      : exerciseIds[currExerciseIndex + 1];

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
                onClick={() =>
                  putExercise({
                    ...exerciseData,
                    [activeKey]: exerciseData[activeKey] - 1,
                  })
                }
              >
                上一页
              </BtnMargin>
              <BtnMargin
                onClick={() =>
                  putExercise({
                    ...exerciseData,
                    [activeKey]: exerciseData[activeKey] + 1,
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
              {showSavedAlert && (
                <Alert variant="success" style={{ marginRight: 10 }}>
                  保存成功
                </Alert>
              )}
              {/* <Form.Check
                type="checkbox"
                label="有错误"
                checked={invalid}
                onChange={(e) => putInvalid(e.target.checked)}
              /> */}
              <div>
                {prevExerciseId !== -1 && (
                  <BtnMargin
                    onClick={() =>
                      navigate(`/exercise/${prevExerciseId}`, {
                        state: { token, exerciseIds },
                      })
                    }
                  >
                    上一个练习
                  </BtnMargin>
                )}
                {nextExerciseId !== -1 && (
                  <BtnMargin
                    onClick={() =>
                      navigate(`/exercise/${nextExerciseId}`, {
                        state: { token, exerciseIds },
                      })
                    }
                  >
                    下一个练习
                  </BtnMargin>
                )}
              </div>
            </div>
          </div>
          <Form.Select
            aria-label="Exercise Type"
            style={{ width: "fit-content", margin: 5 }}
            onChange={(e) => {
              const newExerciseData = {
                ...exerciseData,
                isDraft: true,
                exerciseTypeId: parseInt(e.target.value),
              };
              putExercise(newExerciseData);
            }}
            value={exerciseData.exerciseTypeId}
          >
            <option value={0}>短文填空</option>
            <option value={1}>语文应用</option>
          </Form.Select>
          <div>
            <TextareaAutosize
              autoFocus
              onFocus={(e) => {
                setTimeout(() => (e.target.selectionEnd = 0), 0);
              }}
              value={rawString}
              onChange={(e) =>
                putExercise({ ...exerciseData, rawString: e.target.value })
              }
              cols={80}
              ref={myRef}
              onMouseUp={() =>
                setQuery(
                  myRef.current.value.substring(
                    myRef.current.selectionStart,
                    myRef.current.selectionEnd
                  )
                )
              }
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
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
                  onClick={() =>
                    putExercise({ ...exerciseData, isDraft: true })
                  }
                  style={{ marginLeft: "5px" }}
                >
                  保存草稿
                </Button>
              </div>
              <Button
                onClick={() => putExercise({ ...exerciseData, isDraft: false })}
              >
                发布
              </Button>
            </div>
            <Errors id={id} setShowDangerAlert={setShowDangerAlert} />
            {query !== "" && (
              <div style={{ margin: 5 }}>
                <SearchResult query={query} token={token} />
              </div>
            )}
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
