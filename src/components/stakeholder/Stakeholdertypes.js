import React, { useState, useEffect } from "react";
import axiosHandler from "../../handlers/axiosHandler";

const Stakeholdertypes = () => {
    useEffect(() => {
        // gat all stakeholders
      axiosHandler({setData:setResponse, setError, method:"GET", path:"stackholdertype/", data:stakeholderInfo});
      }, []);
    
      const [stakeholderInfo, setstakeholderInfo] = useState({});
      const [response, setResponse] = useState();
      const [error, setError] = useState();
      function changeHandler(e) {
        const { name, value } = e.target;
        setstakeholderInfo({ ...stakeholderInfo, [name]: value });
      }
      const createStakeholder = async () => {
        await axiosHandler({setData:setResponse, setError, method:"POST", path:"stackholdertype/", data:stakeholderInfo});
        alert("done")
      };
      return (
        <div>
          <div>
            <input
              placeholder="Place of service"
              type="text"
              name="Place_of_service"
              onChange={changeHandler}
            />
            <br />
            <br />
            <button onClick={createStakeholder}>CREATE</button>
          </div>
          <hr />
        </div>
      );
}

export default Stakeholdertypes
