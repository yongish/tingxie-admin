import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import { Table } from "react-bootstrap";
import { getHost } from "./utils/env";
import { parseZonedDateTime } from "@internationalized/date";

const Home = () => {
  const [exerciseMetadata, setExerciseMetadata] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${getHost()}exercises-metadata`)
      .then((response) => response.json())
      .then((data) => setExerciseMetadata(data));
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
      <BtnMarginBottom onClick={handleLogout}>Logout</BtnMarginBottom>
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
              source,
              exerciseTypeId,
              createdAt,
              lastEditedAt,
              lastEditedBy,
            } = item;
            return (
              <tr>
                <td>{i + 1}</td>
                <td>{source}</td>
                <td>{exerciseTypeId === 0 ? "短文填空" : "选词填空"}</td>
                <td>
                  <DivOppositeEnds>
                    {lastEditedBy}
                    <Button onClick={() => {}}>Edit</Button>
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
