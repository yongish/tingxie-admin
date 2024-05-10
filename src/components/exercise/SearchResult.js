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
          const { id, source, sourceUrl, rawString, isDraft } = item;
          const firstIndex = Math.max(0, rawString.indexOf(query[0]) - 10);
          const lastIndex = Math.min(
            query.length - 1,
            rawString.indexOf(query[query.length - 1]) + 10
          );
          return (
            <tr key={id}>
              <td>{i + 1}</td>
              {/* todo: replace with link */}
              <td>{source}</td>
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
