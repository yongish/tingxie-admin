import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { getHost } from "../utils/env";
import { options } from "./errorValues";

const getOptionDiff = (a, b) =>
  a.map((e) => e.value).filter((v) => !b.map((e) => e.value).includes(v));

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const Errors = ({ id }) => {
  const [errors, setErrors] = useState([]);

  const prevErrors = usePrevious(errors);
  useEffect(() => {
    if (prevErrors?.length > errors.length) {
      getOptionDiff(prevErrors, errors).forEach((errorId) =>
        fetch(`${getHost()}exercise-data/${id}/error/${errorId}`, {
          method: "DELETE",
        })
      );
    } else if (errors.length > prevErrors?.length) {
      getOptionDiff(errors, prevErrors).forEach((errorId) =>
        fetch(`${getHost()}exercise-data/${id}/error/${errorId}`, {
          method: "PUT",
        })
      );
    } else {
      fetch(`${getHost()}exercise-data/${id}/error`).then((response) => {
        const data = response.json();
        setErrors(data);
      });
    }
  }, [errors, id, prevErrors]);

  return (
    <div>
      <Select
        options={options}
        isMulti={true}
        placeholder="Errors"
        onChange={(e) => setErrors(e)}
      />
    </div>
  );
};

export default Errors;
