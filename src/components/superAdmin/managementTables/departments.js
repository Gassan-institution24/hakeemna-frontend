import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../../handlers/axiosHandler";
import AddModel from "../../../handlers/AddModel";
import EditModel from "../../../handlers/EditModel";
import ModelCard from "../../../handlers/ModelCard";

function Departments(props) {
  const [data, setData] = useState();
  const [isAdding, setIsAdding] = useState(false);
  const [editting, setEditting] = useState("");
  const [error, setError] = useState();

  const fetchData = async () => {
    await axiosHandler({
      setData,
      setError,
      method: "GET",
      path: "departments",
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      Departments
      {isAdding && (
        <AddModel
          textDetails={[
            { name: "name_arabic", nameShown: "name_arabic" },
            { name: "name_english", nameShown: "name_english" },
            { name: "general_info", nameShown: "general_info" },
          ]}
          selectDetails={[
            {
              name: "unit_service",
              nameShown: "unit service",
              path: "unitservice",
            },
          ]}
          path={"departments"}
          setIsAdding={setIsAdding}
          fetchData={fetchData}
        />
      )}
      {editting && (
        <EditModel
          textDetails={[
            { name: "name_arabic", nameShown: "name_arabic" },
            { name: "name_english", nameShown: "name_english" },
            { name: "general_info", nameShown: "general_info" },
          ]}
          selectDetails={[
            {
              name: "unit_service",
              nameShown: "unit service",
              path: "unitservice",
            },
          ]}
          path={"departments"}
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
            path={"departments"}
            h2items={["name_arabic", "name_english", "general_info"]}
          />
        );
      })}
      {JSON.stringify(data)}
      {JSON.stringify(props.model)}
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
  model: state.model,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Departments);
