import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosHandler from "../../handlers/axiosHandler";
const Stackholderupdate = ({ info }) => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/stackholder/")
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        //console.log(err);
      });
  }, []);

  const update = (e, id) => {
    axiosHandler({
      data: { stakeholder_name: data },
      setError,
      method: "PATCH",
      path: `stackholder/${id}`,
    });
  };
  return (
    <>
      <form onSubmit={(e) => update(e, info._id)}>
        <input
          onChange={(e) => {
            setData(e.target.value);
          }}
        />
        <button>ubdate</button>
      </form>
    </>
  );
};

export default Stackholderupdate;
