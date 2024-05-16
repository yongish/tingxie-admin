import React, { useEffect, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import { getHost } from "../utils/env";

const SearchResult = ({ id, query, token }) => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(`${getHost()}exercise-data/${id}/search/${query}`, {
      headers: { Authorization: `${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      });
  }, [id, query, token]);

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

  if (results.length === 0) {
    return <p>No duplicate exercises found.</p>;
  }

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Source</th>
          <th>Published</th>
          <th>Text Found</th>
        </tr>
      </thead>
      <tbody>
        {results.map((item, i) => {
          const { id, source, rawString, isDraft } = item;
          const firstIndex = Math.max(0, rawString.indexOf(query) - 10);
          const lastIndex = Math.min(
            rawString.length - 1,
            rawString.indexOf(query) + 10
          );
          return (
            <tr key={id}>
              <td>{i + 1}</td>
              <td>
                <a
                  href={`${window.location.protocol}//${window.location.host}/exercise/${id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {source}
                </a>
              </td>
              <td>{(!isDraft).toString()}</td>
              <td>{rawString.substring(firstIndex, lastIndex)}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default SearchResult;
