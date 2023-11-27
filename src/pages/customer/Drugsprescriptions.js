import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../handlers/axiosHandler";
import AddModel from "../../handlers/AddModel";
import EditModel from "../../handlers/EditModel";
import ModelCard from "../../handlers/ModelCard";
const Drugsprescriptions = (props) => {
  const [data, setData] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editting, setEditting] = useState("");
  const [error, setError] = useState();
  const fetchData = async () => {
    await axiosHandler({
      setData,
      setError,
      method: "GET",
      path: "drugs",
    });
  };
  useEffect(() => {
    fetchData();
  }, []);
return (
  <div className="back">
    {isAdding && (
      <AddModel
        textDetails={[
          {
            name: "Start_time",
            nameShown: "Start time",
            type: "date"
          },
          {
            name: "End_time",
            nameShown: "End time",
            type: "date"
          },
        ]}
        path={"drugs"}
        selectDetails={[
          { name: "unit_service", nameShown: "unit service", path: "unitservice" },
        ]}
        setIsAdding={setIsAdding}
        fetchData={fetchData}
      />
    )}
    {editting && (
      <EditModel
        textDetails={[
          {
            name: "Start_time",
            nameShown: "Start time",
            type: "date"
          },
          {
            name: "End_time",
            nameShown: "End time",
            type: "date"
          },
        ]}
        path={`drugs`}
        selectDetails={[
          { name: "unit_service", nameShown: "unit service", path: "unitservice" },
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
          path={"drugs"}
          h2items={["Start_time", "End_time", "unit service"]}
        />
      );
    })}
    {JSON.stringify(data)}
    {JSON.stringify(props.model)}
  </div>
)
};

const mapStateToProps = (state) => ({
  user: state.user,
  model: state.model,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Drugsprescriptions);