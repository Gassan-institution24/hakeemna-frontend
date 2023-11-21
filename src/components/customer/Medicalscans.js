import React, { useState, useEffect } from "react";
import axiosHandler from "../../handlers/axiosHandler";

const Medicalscans = () => {
    useEffect(() => {
        // gat all medicalscans
      axiosHandler({setData:setResponse, setError, method:"GET", path:"medicalScan/", data:customerInfo});
      }, []);
    
      const [customerInfo, setCustomerInfo] = useState({});
      const [response, setResponse] = useState();
      const [error, setError] = useState();
      function changeHandler(e) {
        const { name, value } = e.target;
        setCustomerInfo({ ...customerInfo, [name]: value });
      }
      const createMedicalscans = async () => {
        await axiosHandler({setData:setResponse, setError, method:"POST", path:"medicalScan/", data:customerInfo});
      };
      return (
        <div>
          <div>
            <input
              placeholder="Days"
              type="number"
              name="file"
              onChange={changeHandler}
            />
            <br />
            <br />
            <button onClick={createMedicalscans}>CREATE</button>
          </div>
          <hr />
        </div>
      );
}

export default Medicalscans

