import React, { useState, useEffect } from "react";
import axiosHandler from "../../handlers/axiosHandler";

const Drugsprescriptions = () => {
  useEffect(() => {
    // gat all drugsprescriptions
    axiosHandler({
      setData:setResponse,
      setError:setError,
      method:"GET",
      path:"drugs/",
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
  const createDrugsprescriptions = async () => {
    await axiosHandler({
      setData:setResponse,
      setError,
      method:"POST",
      path:"drugs/",
      data:customerInfo
  });
  };
  return (
    <div>
      <div>
        <input
          placeholder="Days"
          type="number"
          name="Num_days"
          onChange={changeHandler}
        />
        <br />
        <br />
        <button onClick={createDrugsprescriptions}>CREATE</button>
      </div>
      <hr/>
    </div>
  );
};

export default Drugsprescriptions;
