import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { getHost } from "./utils/env";

const Home = () => {
  const [exerciseMetadata, setExerciseMetadata] = useState([]);
  const [filteredExerciseMetadata, setFilteredExerciseMetadata] = useState([]);
  const [showPublished, setShowPublished] = useState(true);
  const [showNotPublished, setShowNotPublished] = useState(true);

  const location = useLocation();
  const token = location.state.token;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${getHost()}exercises-metadata`, {
      headers: { Authorization: `${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        const indexedData = data.map((item, i) => ({ ...item, index: i }));
        setExerciseMetadata(indexedData);
        setFilteredExerciseMetadata(indexedData);
      });
  }, [token]);

  useEffect(
    () => setFilteredExerciseMetadata(exerciseMetadata),
    [exerciseMetadata]
  );

  useEffect(() => {
    if (showPublished && !showNotPublished) {
      setFilteredExerciseMetadata(
        exerciseMetadata.filter((item) => !item.isDraft)
      );
    } else if (!showPublished && showNotPublished) {
      setFilteredExerciseMetadata(
        exerciseMetadata.filter((item) => item.isDraft)
      );
    } else if (showPublished && showNotPublished) {
      setFilteredExerciseMetadata(exerciseMetadata);
    } else {
      setFilteredExerciseMetadata([]);
    }
  }, [showPublished, showNotPublished, exerciseMetadata]);

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
      <DivOppositeEnds>
        <BtnMarginBottom onClick={handleLogout}>Logout</BtnMarginBottom>
        <div style={{ display: "flex" }}>
          <CheckMargin
            type="checkbox"
            id="edited"
            label="Published"
            checked={showPublished}
            onChange={() => setShowPublished(!showPublished)}
          />
          <CheckMargin
            type="checkbox"
            id="not-edited"
            label="Not Published"
            checked={showNotPublished}
            onChange={() => setShowNotPublished(!showNotPublished)}
          />
        </div>
      </DivOppositeEnds>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Source</th>
            <th>Exercise Type</th>
            <th>Published</th>
            <th>Last Edited By</th>
            <th>Last Edited At</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {filteredExerciseMetadata.map((item) => {
            const {
              index,
              id,
              source,
              exerciseTypeId,
              createdAt = "1970-01-00T00:00[UTC]",
              lastEditedAt = "1970-01-00T00:00[UTC]",
              lastEditedBy,
              isDraft,
            } = item;
            return (
              <tr key={id}>
                <td>{index + 1}</td>
                <td>{source}</td>
                <td>{exerciseTypeId === 0 ? "短文填空" : "选词填空"}</td>
                <td>{(!isDraft).toString()}</td>
                <td>
                  <DivOppositeEnds>
                    {lastEditedBy}
                    <Button
                      onClick={() =>
                        navigate(`/exercise/${id}`, {
                          state: { token },
                        })
                      }
                      style={{ marginLeft: "5px" }}
                    >
                      Edit
                    </Button>
                  </DivOppositeEnds>
                </td>
                <td>{new Date(lastEditedAt).toLocaleString()}</td>
                <td>{new Date(createdAt).toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </DivMargin>
  );
};

export default Home;

const DivMargin = styled.div`
  margin: 10px;
`;
const BtnMarginBottom = styled(Button)`
  margin-bottom: 10px;
`;
const DivOppositeEnds = styled.div`
  display: flex;
  justify-content: space-between;
`;
const CheckMargin = styled(Form.Check)`
  margin: 5px;
`;
