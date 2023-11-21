import React, { useState, useEffect } from "react";
import axiosHandler from "../../handlers/axiosHandler";

const Customer = () => {
  useEffect(() => {
    // gat all customers 
    axiosHandler({setData:setResponse, setError, method:"GET", path:"customer/", data:customerInfo});
  }, []);

  const [customerInfo, setCustomerInfo] = useState({});
  const [response, setResponse] = useState();
  const [error, setError] = useState();
  function changeHandler(e) {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  }
  const createCustomer = async () => {
    await axiosHandler({
      setData:setResponse,
      setError,
      method:"POST",
      path:"customer/add",
      data:customerInfo
  });
  };
  return (
    <div>
      <input
        placeholder="Name"
        type="text"
        name="first_name"
        onChange={changeHandler}
      />
      <br />
      <br />
      <button onClick={createCustomer}>CREATE</button>
      <hr/>
    </div>
  );
};

export default Customer;
