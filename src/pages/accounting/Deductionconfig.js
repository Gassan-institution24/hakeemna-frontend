import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../handlers/axiosHandler";
import AddModel from "../../handlers/AddModel";
import EditModel from "../../handlers/EditModel";
import ModelCard from "../../handlers/ModelCard";
const Deductionconfig = (props) => {
  const [data, setData] = useState();
  const [isAdding, setIsAdding] = useState(false);
  const [editting, setEditting] = useState("");
  const [error, setError] = useState();
  const fetchData = async () => {
    await axiosHandler({
      setData,
      setError,
      method: "GET",
      path: "deductionconfig",
    });
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      Deductionconfig
      {isAdding && (
        <AddModel
          textDetails={[
            {
              name: "Place_of_service",
              nameShown: "Place_of_service",
              type: "string",
            },
          ]}
          path={"deductionconfig"}
          selectDetails={[
            {
              name: "unit_service",
              nameShown: "unit service",
              path: "unitservice",
            },
          ]}
          setIsAdding={setIsAdding}
          fetchData={fetchData}
        />
      )}
      {editting && (
        <EditModel
          textDetails={[
            {
              name: "Place_of_service",
              nameShown: "Place_of_service",
              type: "string",
            },
          ]}
          path={`deductionconfig`}
          selectDetails={[
            {
              name: "unit_service",
              nameShown: "unit service",
              path: "unitservice",
            },
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
            path={"deductionconfig"}
            h2items={["Place_of_service", "unit_service"]}
          />
        );
      })}
      
      
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  model: state.model,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Deductionconfig);
