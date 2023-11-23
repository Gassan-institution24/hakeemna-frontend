import React, { useState, useEffect } from "react";
import axiosHandler from "../../handlers/axiosHandler";

const Suppliersofferscreate = () => {
    useEffect(() => {
        // gat all suppliersoffers
      axiosHandler({setData:setResponse, setError, method:"GET", path:"suppliersoffers/", data:suppliersoffersInfo});
      }, []);
    useEffect(() => {
      axiosHandler({setData:setEmployeetype, setError, method:"GET", path:"employeetypes"});
      }, []);
    
    useEffect(() => {
      axiosHandler({setData:setEmployeetype, setError, method:"GET", path:"stackholder"});
      }, []);
    
      const [employeetype, setEmployeetype] = useState([]);
      const [suppliersoffersInfo, setSuppliersoffersInfo] = useState([]);
      const [stakeholder, setStakeholder] = useState([]);
      const [response, setResponse] = useState();
      const [error, setError] = useState();
      function changeHandler(e) {
        const { name, value } = e.target;
        setSuppliersoffersInfo({ ...suppliersoffersInfo, [name]: value });
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
            <select>
          <option>Select employeetype</option>
          {employeetype.map((employeetype,i)=>{
                    return(
                        <option value={employeetype._id} key={i}>
                          {employeetype.name_english}
                        </option>
                    )
                })}
        </select>
        <select>
          <option>Select stakeholder</option>
          {stakeholder.map((stakeholder,i)=>{
                    return(
                        <option value={stakeholder._id} key={i}>
                          {stakeholder.type}
                        </option>
                    )
                })}
        </select>
            <button onClick={createSuppliersoffers}>CREATE</button>
          </div>
          <hr />
        </div>
      );
}

export default Suppliersofferscreate
