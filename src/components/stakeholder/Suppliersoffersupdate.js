import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosHandler from "../../handlers/axiosHandler";
const Suppliersofferscreate = ({ info }) => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/suppliersoffers/")
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const update = (id) => {
    axiosHandler({
      data: { Offer_name: data },
      setError,
      method: "PATCH",
      path: `suppliersoffers/${id}`,
    });
  };
  return (
    <div>
      <form onSubmit={() => update(info._id)}>
        <input
          onChange={(e) => {
            setData(e.target.value);
          }}
        />
        <button>ubdate</button>
      </form>
    </div>
  );
};

export default Suppliersofferscreate;
