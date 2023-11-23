import React, { useState, useEffect } from "react";
import axiosHandler from "../../handlers/axiosHandler";

const Stackholdercreate = () => {

  const [stakeholderInfo, setstakeholderInfo] = useState({});
  const [unitservice, setUnitservice] = useState([]);
  const [stackholdertype, setStackholdertype] = useState([]);
  const [error, setError] = useState();
  function changeHandler(e) {
    const { name, value } = e.target;
    setstakeholderInfo({ ...stakeholderInfo, [name]: value });
  }
  const createStakeholder = async () => {
    await axiosHandler({
      setError,
      method: "POST",
      path: "stackholder/",
      data: stakeholderInfo,
    });
  };
  useEffect(()=>{
    axiosHandler({setData:setUnitservice,setError,method:'GET',path:'unitservice'})
},[])
  useEffect(()=>{
    axiosHandler({setData:setStackholdertype,setError,method:'GET',path:'stackholdertype'})
},[])
  return (
    <>
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
        <select>
          <option>Select stackholdertype</option>
          {stackholdertype.map((stack,i)=>{
                    return(
                        <option value={stack._id} key={i}>
                          {stack.type}
                        </option>
                    )
                })}
        </select>
        <button onClick={createStakeholder}>CREATE</button>
      </div>
      <hr />
    </div>
</>
  );
};

export default Stackholdercreate;
