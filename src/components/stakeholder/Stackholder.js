import React, { useState, useEffect } from "react";
import axiosHandler from "../../handlers/axiosHandler";

const Stackholder = () => {
  useEffect(() => {
    // gat all stakeholder
    axiosHandler({
      setData: setResponse,
      setError,
      method: "GET",
      path: "stackholder/",
      data: customerInfo,
    });
  }, []);

  const [customerInfo, setCustomerInfo] = useState({});
  const [response, setResponse] = useState();
  const [error, setError] = useState();
  function changeHandler(e) {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  }
  const createStakeholder = async () => {
    await axiosHandler({
      setData: setResponse,
      setError,
      method: "POST",
      path: "stackholder/",
      data: customerInfo,
    });
    alert("done");
  };
  return (
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
  );
};

export default Stackholder;
