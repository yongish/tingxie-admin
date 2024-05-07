import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { getHost } from "../utils/env";

const getOptionDiff = (a, b) =>
  a.map((e) => e.value).filter((v) => !b.map((e) => e.value).includes(v));

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const Errors = (id) => {
  const [errors, setErrors] = useState([]);

  const options = [
    { value: 0, label: "无法保存或发布" },
    { value: 1, label: "可能重复" },
    { value: 2, label: "文本不完整" },
    { value: 3, label: "文本错误" },
    { value: 4, label: "答案错" },
    { value: 5, label: "其他错误" },
  ];
  const prevErrors = usePrevious(errors);
  useEffect(() => {
    if (prevErrors.length > errors.length) {
      getOptionDiff(prevErrors, errors).forEach((errorId) =>
        fetch(`${getHost()}exercise-data/${id}/error/${errorId}`, {
          method: "DELETE",
        })
      );
    } else if (errors.length > prevErrors.length) {
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
