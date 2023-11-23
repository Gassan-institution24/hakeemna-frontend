import React, { useState, useEffect } from "react";
import axiosHandler from "../../handlers/axiosHandler";

const Stakeholdertypescreate = () => {
 
      const [stakeholderInfo, setstakeholderInfo] = useState({});
      const [unitservice, setUnitservice] = useState([]);
      const [error, setError] = useState();
      function changeHandler(e) {
        const { name, value } = e.target;
        setstakeholderInfo({ ...stakeholderInfo, [name]: value });
      }
      const createStakeholder = async () => {
        await axiosHandler({ setError, method:"POST", path:"stackholdertype/", data:stakeholderInfo});
        alert("done")
      };
      useEffect(()=>{
        axiosHandler({setData:setUnitservice,setError,method:'GET',path:'unitservice'})
    },[])


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
            <select>
          <option>Select unitservice</option>
          {unitservice.map((unit,i)=>{
                    return(
                        <option value={unit._id} key={i}>
                          {unit.name_english}
                        </option>
                    )
                })}
        </select>
            <button onClick={createStakeholder}>CREATE</button>
          </div>
          <hr />
        </div>
      );
}

export default Stakeholdertypescreate
