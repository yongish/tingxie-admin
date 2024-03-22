import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { getHost } from "./utils/env";
import { parseZonedDateTime } from "@internationalized/date";

const Home = () => {
  const [exerciseMetadata, setExerciseMetadata] = useState([]);
  const [showEdited, setShowEdited] = useState(true);
  const [showNotEdited, setShowNotEdited] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${getHost()}exercises-metadata`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        setExerciseMetadata(data)
      });
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
      <DivOppositeEnds>
        <BtnMarginBottom onClick={handleLogout}>Logout</BtnMarginBottom>
        <div style={{ display: "flex" }}>
          <CheckMargin
            type="checkbox"
            id="edited"
            label="Edited"
            checked={showEdited}
            onChange={() => setShowEdited(!showEdited)}
          />
          <CheckMargin
            type="checkbox"
            id="not-edited"
            label="Not Edited"
            checked={showNotEdited}
            onChange={() => setShowNotEdited(!showNotEdited)}
          />
        </div>
      </DivOppositeEnds>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Source</th>
            <th>Exercise Type</th>
            <th>Last Edited By</th>
            <th>Last Edited At</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {exerciseMetadata.map((item, i) => {
            const {
              id,
              source,
              exerciseTypeId,
              createdAt,
              lastEditedAt,
              lastEditedBy,
            } = item;
            return (
              <tr key={id}>
                <td>{i + 1}</td>
                <td>{source}</td>
                <td>{exerciseTypeId === 0 ? "短文填空" : "选词填空"}</td>
                <td>
                  <DivOppositeEnds>
                    {lastEditedBy}
                    <Button onClick={() => navigate(`/exercise/${id}`)}>
                      Edit
                    </Button>
                  </DivOppositeEnds>
                </td>
                <td>
                  {parseZonedDateTime(lastEditedAt).toDate().toLocaleString()}
                </td>
                <td>
                  {parseZonedDateTime(createdAt).toDate().toLocaleString()}
                </td>
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
