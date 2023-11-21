import React, { useState, useEffect } from "react";
import axiosHandler from "../../handlers/axiosHandler";

const Suppliersoffers = () => {
    useEffect(() => {
        // gat all suppliersoffers
      axiosHandler({setData:setResponse, setError, method:"GET", path:"suppliersoffers/", data:suppliersoffersInfo});
      }, []);
    
      const [suppliersoffersInfo, setsuppliersoffersInfo] = useState({});
      const [response, setResponse] = useState();
      const [error, setError] = useState();
      function changeHandler(e) {
        const { name, value } = e.target;
        setsuppliersoffersInfo({ ...suppliersoffersInfo, [name]: value });
      }
      const createSuppliersoffers= async () => {
        await axiosHandler({setData:setResponse, setError, method:"POST", path:"suppliersoffers/", data:suppliersoffersInfo});
        alert("done")
      };
      return (
        <div>
          <div>
            <input
              placeholder="Offer name"
              type="text"
              name="Offer_name"
              onChange={changeHandler}
            />
            <br />
            <br />
            <button onClick={createSuppliersoffers}>CREATE</button>
          </div>
          <hr />
        </div>
      );
}

export default Suppliersoffers
