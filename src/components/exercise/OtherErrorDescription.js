import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { getHost } from "../utils/env";

const OtherErrorDescription = ({ id, setShowDangerAlert }) => {
  const [otherErrorDescription, setOtherErrorDescription] = useState("");

  useEffect(() => {
    const fetchData = () =>
      fetch(`${getHost()}exercise-data/${id}/error/description`)
        .then((response) => response.json())
        .then((data) => setOtherErrorDescription(data));
    fetchData();
  }, [id]);

  const updateDescription = async () => {
    const response = await fetch(
      `${getHost()}exercise-data/${id}/error/description/${otherErrorDescription}`,
      { method: "PUT" }
    );
    if (response.status !== 200) {
      setShowDangerAlert();
    }
  };

  return (
    <div style={{ margin: 5 }}>
      <h6>其他错误描述</h6>
      <TextareaAutosize
        value={otherErrorDescription}
        onChange={(e) => setOtherErrorDescription(e.target.value)}
        onBlur={updateDescription}
      />
    </div>
  );
};

export default OtherErrorDescription;
