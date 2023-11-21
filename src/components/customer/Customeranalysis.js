import React, { useState, useEffect } from "react";
import axiosHandler from "../../handlers/axiosHandler";
const Customeranalysis = () => {
  useEffect(() => {
    // gat all customeranalysis
    axiosHandler({
      setData:setResponse,
      setError,
      method:"GET",
      path:"customeranalysis/",
      data:customerInfo
  });
  }, []);

  const [customerInfo, setCustomerInfo] = useState({});
  const [response, setResponse] = useState();
  const [error, setError] = useState();
  function changeHandler(e) {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  }
  const createCustomeranalysis = async () => {
    await axiosHandler(
      {
      setData:setResponse,
      setError,
      method:"POST",
      path:"customeranalysis/add",
      data:customerInfo
      });

  };
  return (
    <div>
      <div>
        <input
          placeholder="file"
          type="file"
          name="file"
          onChange={changeHandler}
        />
        <br />
        <br />
        <button onClick={createCustomeranalysis}>CREATE</button>
      </div>
      <hr/>
    </div>
  );
};

export default Customeranalysis;
