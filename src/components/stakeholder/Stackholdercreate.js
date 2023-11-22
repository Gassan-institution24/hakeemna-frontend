import React, { useState, useEffect } from "react";
import axiosHandler from "../../handlers/axiosHandler";

const Stackholdercreate = () => {

  const [stakeholderInfo, setstakeholderInfo] = useState({});
  const [response, setResponse] = useState();
  const [error, setError] = useState();
  function changeHandler(e) {
    const { name, value } = e.target;
    setstakeholderInfo({ ...stakeholderInfo, [name]: value });
  }
  const createStakeholder = async () => {
    await axiosHandler({
      setError,
      method: "POST",
      path: "stackholder/",
      data: stakeholderInfo,
    });
  };
  return (
    <>
    <div>
      <div>
        <input
          placeholder="stakeholder name"
          type="text"
          name="stakeholder_name"
          onChange={changeHandler}
        />
        <br />
        <br />
        <button onClick={createStakeholder}>CREATE</button>
      </div>
      <hr />
    </div>
</>
  );
};

export default Stackholdercreate;
