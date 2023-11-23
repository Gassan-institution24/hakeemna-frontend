import React, { useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "./axiosHandler";

function ModelCard({ one, fetchData, setEditting, path, h2items, pitems }) {
    const [error,setError]=useState()
  async function deleteHandler() {
    await axiosHandler({ method: "DELETE",setError, path: `${path}/${one._id}` });
    fetchData();
  }
  return (
    <div className="border">
      {h2items?.map((item) => {
        return(
            <h2>{item}:{one[item]}</h2>
        )
      })}
      {pitems?.map((item) => {
        return(
            <p>{item}:{one[item]}</p>
        )
      })}

      <button
        onClick={() => {
          setEditting(one._id);
        }}
      >
        Edit
      </button>
      <button onClick={deleteHandler}>Delete</button>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
  model: state.model,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(ModelCard);
