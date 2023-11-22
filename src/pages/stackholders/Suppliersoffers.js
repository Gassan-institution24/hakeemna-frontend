import React, { useState, useEffect } from "react";
import axiosHandler from "../../handlers/axiosHandler";
import Suppliersofferscreate from "../../components/stakeholder/Suppliersofferscreate";
import Suppliersoffersupdate from "../../components/stakeholder/Suppliersoffersupdate";
const Suppliersoffers = () => {
  const [suppliersoffersInfo, setsuppliersoffersInfo] = useState([]);
  const [response, setResponse] = useState();
  const [error, setError] = useState();
  const [updating, setUpdating] = useState(false);
  const [adding, setAdding] = useState(false);
  useEffect(() => {
    // gat all stakeholder
    axiosHandler({
      setData: setsuppliersoffersInfo,
      setError,
      method: "GET",
      path: "suppliersoffers/",
    });
  }, []);

  const Delete = (id) => {
    axiosHandler({
      setError,
      method: "DELETE",
      path: `suppliersoffers/${id}`,
    });
  };
  return (
    <>
      {suppliersoffersInfo?.map((info, i) => {
        return (
          <div key={i}>
            {info.Offer_name}
            {updating && <Suppliersoffersupdate info={info} />}
            {adding && <Suppliersofferscreate />}
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

export default Suppliersoffers;
