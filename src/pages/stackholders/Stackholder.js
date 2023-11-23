import React, { useState, useEffect } from "react";
import axiosHandler from "../../handlers/axiosHandler";
import Stackholderupdate from "../../components/stakeholder/Stackholderupdate";
import Stackholdercreate from "../../components/stakeholder/Stackholdercreate";
const Stackholder = () => {
  const [stakeholderInfo, setstakeholderInfo] = useState([]);
  const [error, setError] = useState();
  const [updating, setUpdating] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    // gat all stakeholder
    axiosHandler({
      setData: setstakeholderInfo,
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
    });
  };

  return (
    <>
      {stakeholderInfo?.map((info, i) => {
        return (
          <div key={i}>
            {info.stakeholder_name}
            {updating && <Stackholderupdate info={info} />}
            {adding && <Stackholdercreate />}
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
    </>
  );
};

export default Stackholder;
