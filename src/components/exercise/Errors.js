import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { getHost } from "../utils/env";
import { options } from "./errorValues";
import WrongAnswers from "./WrongAnswers";

const getOptionDiff = (a, b) =>
  a.map((e) => e.value).filter((v) => !b.map((e) => e.value).includes(v));

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const Errors = ({ exerciseData, id, setShowDangerAlert }) => {
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
    }
  }, [errors, id, prevErrors]);

  useEffect(() => {
    fetch(`${getHost()}exercise-data/${id}/error`)
      .then((response) => response.json())
      .then((data) => setErrors(data));
  }, []);

  console.log("errors", errors);

  return (
    <div>
      <Select
        options={options}
        isMulti={true}
        placeholder="Errors"
        onChange={(e) => {
          console.log("e", e);
          setErrors(e);
        }}
      />
      {errors.map((e) => e.value).includes(4) && (
        <WrongAnswers id={id} setShowDangerAlert={setShowDangerAlert} />
      )}
    </div>
  );
};

export default Errors;
