import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "./axiosHandler";
import AddModel from "./modelComponents/AddModel";
import EditModel from "./modelComponents/EditModel";
import ModelCard from "./modelComponents/ModelCard";

function Activities({
  path,
  textDetails,
  selectDetails,
  selectDetailsManually,
  selectDetailsRelated,
  selectDetailsRelayed,
  multiSelectDetails,
  h2items,
  pitems,
}) {
  const [data, setData] = useState();
  const [isAdding, setIsAdding] = useState(false);
  const [editting, setEditting] = useState("");
  const [error, setError] = useState();
  const [show, setShow] = useState(false);

  const fetchData = async () => {
    await axiosHandler({
      setData,
      setError,
      method: "GET",
      path: path,
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <button className="block" onClick={() => setShow(!show)}>
        {" "}
        Show {path}
      </button>
      {show&&<div>
        {path}
        {isAdding && (
          <AddModel
            textDetails={textDetails}
            selectDetails={selectDetails}
            selectDetailsManually={selectDetailsManually}
            selectDetailsRelated={selectDetailsRelated}
            selectDetailsRelayed={selectDetailsRelayed}
            multiSelectDetails={multiSelectDetails}
            path={path}
            setIsAdding={setIsAdding}
            fetchData={fetchData}
          />
        )}
        {editting && (
          <EditModel
            textDetails={textDetails}
            selectDetails={selectDetails}
            selectDetailsManually={selectDetailsManually}
            path={path}
            editting={editting}
            fetchData={fetchData}
          />
        )}
        <button
          onClick={() => {
            setIsAdding(!isAdding);
          }}
        >
          Add
        </button>
        {data?.map((one, idx) => {
          return (
            <ModelCard
              key={idx}
              fetchData={fetchData}
              setEditting={setEditting}
              one={one}
              path={path}
              h2items={h2items}
              pitems={pitems}
            />
          );
        })}
      </div>}
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
  model: state.model,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Activities);
