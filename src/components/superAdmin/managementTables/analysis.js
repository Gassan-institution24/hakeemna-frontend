import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../../handlers/axiosHandler";
import AddModel from "../../../handlers/modelComponents/AddModel";
import EditModel from "../../../handlers/modelComponents/EditModel";
import ModelCard from "../../../handlers/modelComponents/ModelCard";

function Analysis(props) {
  const [data, setData] = useState();
  const [isAdding, setIsAdding] = useState(false);
  const [editting, setEditting] = useState("");
  const [error, setError] = useState();

  const fetchData = async () => {
    await axiosHandler({
      setData,
      setError,
      method: "GET",
      path: "analysis",
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      analysis
      {isAdding && (
        <AddModel
          textDetails={[
            { name: "name", nameShown: "name" },
            { name: "description", nameShown: "description" },
          ]}
          path={"analysis"}
          setIsAdding={setIsAdding}
          fetchData={fetchData}
        />
      )}
      {editting && (
        <EditModel
        textDetails={[
            { name: "name", nameShown: "name" },
            { name: "description", nameShown: "description" },
          ]}
          path={"analysis"}
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
            path={"analysis"}
            h2items={["name", "description"]}
          />
        );
      })}
      
      
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
  model: state.model,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Analysis);
