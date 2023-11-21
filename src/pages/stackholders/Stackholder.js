import React, { useState, useEffect } from "react";
import axiosHandler from "../../handlers/axiosHandler";
import Stackholderupdate from "../../components/stakeholder/Stackholderupdate";
const Stackholder = () => {
  const [stakeholderInfo, setstakeholderInfo] = useState({});
  const [response, setResponse] = useState();
  const [error, setError] = useState();
  const [updating, setUpdating] = useState(false);

  
  useEffect(() => {
    // gat all stakeholder
    axiosHandler({
      setData: setResponse,
      setError,
      method: "GET",
      path: "stackholder/",
    });
  }, []);

  const Delete = (id) => {
    axiosHandler({
      setError,
      method: "DELETE",
      path: `stackholder/${id}`,
    })
  }



  return (
    <>
    {
      response?.map((info,i)=>{

        return (
          <div key={i}>
         
          {updating && <Stackholderupdate  setUpdating ={setUpdating}/> }
          <button onClick={()=>{info.setUpdating(!info._id)}}>Update</button>
          <button onClick={()=>Delete(info._id)}>Delete</button>
          </div>
        )
      })
    }
</>
  );
};

export default Stackholder;
