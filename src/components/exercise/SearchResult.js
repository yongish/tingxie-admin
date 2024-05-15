import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { getHost } from "../utils/env";

const SearchResult = ({ query, token }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(`${getHost()}exercise-data/search/${query}`, {
      headers: { Authorization: `${token}` },
    })
      .then((response) => response.json())
      .then((data) => setResults(data));
  }, [query, token]);

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
