import React, { useState, useEffect } from "react";
import axiosHandler from "../../handlers/axiosHandler";
import Stakeholdertypesupdate from "../../components/stakeholder/Stakeholdertypesupdate";
import Stakeholdertypescreate from "../../components/stakeholder/Stakeholdertypescreate";
const Stakeholdertypes = () => {
  useEffect(() => {
    // gat all stakeholders
    axiosHandler({
      setData: setResponse,
      setError,
      method: "GET",
      path: "stackholdertype/",
    });
  }, []);
  const [response, setResponse] = useState([]);
  const [error, setError] = useState();
  const [newdata, setNewdata] = useState();
  const [updating, setUpdating] = useState(false);
  const [adding, setAdding] = useState(false);

  const Delete = (id) => {
    axiosHandler({
      setError,
      method: "DELETE",
      path: `stackholdertype/${id}`,
    });
  };
  return (
    <div>
      {response?.map((info, i) => {
        return (
          <div key={i}>
            {updating && <Stakeholdertypesupdate info={info} />}
            {adding && <Stakeholdertypescreate />}
            <p>{info.Place_of_service}</p>
            <button onClick={() => Delete(info._id)}>Delete</button>
            <button
              onClick={() => {
                setUpdating(!updating);
              }}
            >
              Update
            </button>
            <button
              onClick={() => {
                setAdding(!adding);
              }}
            >
              create
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Stakeholdertypes;
