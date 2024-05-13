import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { getHost } from "../utils/env";

const WrongAnswers = ({ id, setShowDangerAlert }) => {
  const [wrongAnswers, setWrongAnswers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${getHost()}exercise-data/${id}/wrong-answer`
      );
      const data = await response.json();
      setWrongAnswers(data);
    };
    fetchData();
  }, [id]);

  const upsertWrongAnswer = async (i, wrongAnswer) => {
    const response = await fetch(
      `${getHost()}exercise-data/${id}/wrong-answer`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wrongAnswer),
      }
    );
    if (response.status !== 200) {
      setShowDangerAlert(true);
    }
  };

  const deleteWrongAnswer = async (questionIndex) => {
    const response = await fetch(
      `${getHost()}exercise-data/${id}/wrong-answer/${questionIndex}`,
      {
        method: "DELETE",
      }
    );
    if (response.status === 200) {
      setWrongAnswers(
        wrongAnswers.filter((w) => w.questionIndex !== questionIndex)
      );
    } else {
      setShowDangerAlert(true);
    }
  };

  return (
    <div style={{ margin: 5 }}>
      <h6>Wrong answers</h6>
      <div>
        {wrongAnswers.length === 0 && (
          <div>You haven't added any wrong answers.</div>
        )}
        {wrongAnswers.map((w, i) => (
          <div
            key={"wrongAnswer" + i}
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "baseline",
            }}
          >
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="inputGroup-question-number">
                Q no.
              </InputGroup.Text>
              <Form.Control
                type="number"
                min={1}
                value={w.questionIndex}
                onChange={(e) =>
                  setWrongAnswers([
                    ...wrongAnswers.slice(0, i),
                    {
                      ...w,
                      questionIndex: parseInt(e.target.value),
                    },
                    ...wrongAnswers.slice(i + 1, wrongAnswers.length),
                  ])
                }
                onBlur={(e) =>
                  upsertWrongAnswer(i, {
                    ...w,
                    questionIndex: parseInt(e.target.value),
                  })
                }
                aria-label="question-number"
                aria-describedby="inputGroup-question-number"
              />
            </InputGroup>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="inputGroup-stated-answer">
                Stated answer
              </InputGroup.Text>
              <Form.Control
                type="number"
                min={1}
                value={w.statedAnswerIndex}
                onChange={(e) =>
                  setWrongAnswers([
                    ...wrongAnswers.slice(0, i),
                    {
                      ...w,
                      statedAnswerIndex: parseInt(e.target.value),
                    },
                    ...wrongAnswers.slice(i + 1, wrongAnswers.length),
                  ])
                }
                onBlur={(e) =>
                  upsertWrongAnswer(i, {
                    ...w,
                    statedAnswerIndex: parseInt(e.target.value),
                  })
                }
                aria-label="stated-answer"
                aria-describedby="inputGroup-stated-answer"
              />
            </InputGroup>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="inputGroup-correct-answer">
                Correct answer
              </InputGroup.Text>
              <Form.Control
                type="number"
                min={1}
                value={w.correctAnswerIndex}
                onChange={(e) =>
                  setWrongAnswers([
                    ...wrongAnswers.slice(0, i),
                    {
                      ...w,
                      correctAnswerIndex: parseInt(e.target.value),
                    },
                    ...wrongAnswers.slice(i + 1, wrongAnswers.length),
                  ])
                }
                onBlur={(e) =>
                  upsertWrongAnswer(i, {
                    ...w,
                    correctAnswerIndex: parseInt(e.target.value),
                  })
                }
                aria-label="correct-answer"
                aria-describedby="inputGroup-correct-answer"
              />
            </InputGroup>
            <Button onClick={() => deleteWrongAnswer(w.questionIndex)}>
              Delete
            </Button>
          </div>
        ))}
        <Button
          onClick={() =>
            setWrongAnswers([
              ...wrongAnswers,
              {
                questionIndex: 0,
                statedAnswerIndex: 0,
                correctAnswerIndex: 0,
              },
            ])
          }
        >
          Add wrong answer
        </Button>
      </div>
    </div>
  );
};

export default WrongAnswers;
