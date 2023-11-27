import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../../handlers/axiosHandler";
import AddModel from "../../../handlers/AddModel";
import EditModel from "../../../handlers/EditModel";
import ModelCard from "../../../handlers/ModelCard";

function Activities(props) {
  const [data, setData] = useState();
  const [isAdding, setIsAdding] = useState(false);
  const [editting, setEditting] = useState("");
  const [error, setError] = useState();

  const fetchData = async () => {
    await axiosHandler({
      setData,
      setError,
      method: "GET",
      path: "activities",
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      Activities
      {isAdding && (
        <AddModel
          textDetails={[
            { name: "name", nameShown: "name" },
            { name: "details", nameShown: "details" },
          ]}
          selectDetails={[
            {
              name: "unit_service",
              nameShown: "unit service",
              path: "unitservice",
            },
            {
              name: "department",
              nameShown: "department",
              path: "departments",
            },
          ]}
          selectDetailsManually={[
            {
              name: "status",
              nameShown: "status",
              options: [
                { name: "active", nameShown: "active" },
                { name: "not active", nameShown: "not active" },
              ],
            },
          ]}
          path={"activities"}
          setIsAdding={setIsAdding}
          fetchData={fetchData}
        />
      )}
      {editting && (
        <EditModel
          textDetails={[
            { name: "name", nameShown: "name" },
            { name: "details", nameShown: "details" },
          ]}
          selectDetails={[
            {
              name: "unit_service",
              nameShown: "unit service",
              path: "unitservice",
            },
            {
              name: "department",
              nameShown: "department",
              path: "departments",
            },
          ]}
          selectDetailsManually={[
            {
              name: "status",
              nameShown: "status",
              options: [
                { name: "active", nameShown: "active" },
                { name: "not active", nameShown: "not active" },
              ],
            },
          ]}
          path={"activities"}
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
            path={"activities"}
            h2items={["name", "details"]}
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
export default connect(mapStateToProps, mapDispatchToProps)(Activities);
