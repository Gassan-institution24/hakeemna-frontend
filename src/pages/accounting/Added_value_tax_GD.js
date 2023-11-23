import React, { useState, useEffect } from "react";
import axiosHandler from "../../handlers/axiosHandler";

const Added_value_tax_GD = () => {
    const [taxGD, setTaxGD] = useState([]);
    const [error, setError] = useState([]);
    useEffect(() => {
        // gat all stakeholder
        axiosHandler({
          setData: setTaxGD,
          setError,
          method: "GET",
          path: "addedvaluetaxgd",
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
    {taxGD?.map((tax, i) => {
      return (
        <div key={i}>
          {tax.TAX_code}
          <button onClick={() => Delete(tax._id)}>Delete</button>
          {/* {updating && <Stackholderupdate tax={tax} />}
          {adding && <Stackholdercreate />} */}
          {/* <button onClick={() => Delete(tax._id)}>Delete</button>
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
          </button> */}
        </div>
      );
    })}
  </>
  )
}

export default Added_value_tax_GD
