import React, { useEffect, useState } from "react";
import Select from "react-select";
import { getHost } from "../utils/env";
import { options } from "./errorValues";
import WrongAnswers from "./WrongAnswers";

const Errors = ({ exerciseData, id, setShowDangerAlert }) => {
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchData = () =>
      fetch(`${getHost()}exercise-data/${id}/error`)
        .then((response) => response.json())
        .then((data) =>
          setErrors(
            data.map((value) =>
              options.find((option) => option.value === value)
            )
          )
        );
    fetchData();
  }, [id]);

  const upsertErrors = async (selectedOptions) => {
    const response = await fetch(`${getHost()}exercise-data/${id}/error`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedOptions.map((e) => e.value)),
    });
    if (response.status === 200) {
      setErrors(selectedOptions);
    } else {
      setShowDangerAlert();
    }
  };

  console.log("errors", errors);

  return (
    <div>
      <Select
        value={errors}
        options={options}
        isMulti={true}
        placeholder="Errors"
        onChange={(errorOptions) => upsertErrors(errorOptions)}
      />
      {errors.map((e) => e.value).includes(4) && (
        <WrongAnswers id={id} setShowDangerAlert={setShowDangerAlert} />
      )}
    </div>
  );
};

export default Errors;

// const getOptionDiff = (a, b) =>
//   a.map((e) => e.value).filter((v) => !b.map((e) => e.value).includes(v));

// function usePrevious(value) {
//   const ref = useRef();
//   useEffect(() => {
//     ref.current = value;
//   });
//   return ref.current;
// }

// const prevErrors = usePrevious(errors);
// useEffect(() => {
//   if (prevErrors?.length > errors.length) {
//     getOptionDiff(prevErrors, errors).forEach((errorId) =>
//       fetch(`${getHost()}exercise-data/${id}/error/${errorId}`, {
//         method: "DELETE",
//       })
//     );
//   } else if (errors.length > prevErrors?.length) {
//     getOptionDiff(errors, prevErrors).forEach((errorId) =>
//       fetch(`${getHost()}exercise-data/${id}/error/${errorId}`, {
//         method: "PUT",
//       })
//     );
//   }
// }, [errors, id, prevErrors]);
