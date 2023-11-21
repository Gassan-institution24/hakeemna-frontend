import React, { useState, useEffect } from "react";
import axiosHandler from "../../handlers/axiosHandler";
const Examinationreports = () => {
  useEffect(() => {
    // gat all examinationreports
    axiosHandler({setData:setResponse, setError, method:"GET", path:"examination/", data:customerInfo});
  }, []);

  const [customerInfo, setCustomerInfo] = useState({});
  const [response, setResponse] = useState();
  const [error, setError] = useState();
  function changeHandler(e) {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  }
  const createExaminationreports = async () => {
    await axiosHandler({setData:setResponse, setError, method:"POST", path:"examination/", data:customerInfo});
  };
  return (
    <div>
      <div>
        <input
          placeholder="Days"
          type="date"
          name="Medical_sick_leave_start"
          onChange={changeHandler}
        />
        <br />
        <br />
        <button onClick={createExaminationreports}>CREATE</button>
      </div>
      <hr />
    </div>
  );
};

export default Examinationreports;
