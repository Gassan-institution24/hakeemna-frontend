import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../handlers/axiosHandler";
import AddModel from "../../handlers/AddModel";
import EditModel from "../../handlers/EditModel";
import ModelCard from "../../handlers/ModelCard";


const Measurementtypes = (props) => {
    const [data, setData] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editting, setEditting] = useState("");
    const [error, setError] = useState();
    const fetchData = async () => {
      await axiosHandler({
        setData,
        setError,
        method: "GET",
        path: "measurementtypes",
      });
    };
    useEffect(() => {
      fetchData();
    }, []);
  return (
    <div>
      {isAdding && (
        <AddModel
          textDetails={[
            {
              name: "Measurement_name",
              nameShown: "Measurement name",
            },
            {
              name: "Measurement_type",
              nameShown: "Measurement type",
            },
          ]}
          path={"measurementtypes"}
          selectDetails={[
            { name: "work_shift", nameShown: "work shift", path: "wshifts" },
          ]}
          setIsAdding={setIsAdding}
          fetchData={fetchData}
        />
      )}
      {editting && (
        <EditModel
          textDetails={[
            {
              name: "Measurement_name",
              nameShown: "Measurement name",
            },
            {
              name: "Measurement_type",
              nameShown: "Measurement type",
            },
          ]}
          path={`measurementtypes`}
          selectDetails={[
            { name: "work_shift", nameShown: "work shift", path: "wshifts" },
          ]}
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
            path={"measurementtypes"}
            h2items={["Measurement_name", "Measurement_type", "work_shift"]}
          />
        );
      })}
      
      
    </div>
  )
}

const mapStateToProps = (state) => ({
    user: state.user,
    model: state.model,
  });
  const mapDispatchToProps = {};
  export default connect(mapStateToProps, mapDispatchToProps)(Measurementtypes);