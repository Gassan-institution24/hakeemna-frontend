import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../handlers/axiosHandler";
import AddModel from "../../handlers/AddModel";
import EditModel from "../../handlers/EditModel";
import ModelCard from "../../handlers/ModelCard";

function UnitServices(props) {
  const [data, setData] = useState();
  const [isAdding, setIsAdding] = useState(false);
  const [editting, setEditting] = useState("");
  const [error, setError] = useState();

  const fetchData = async () => {
    await axiosHandler({
      setData,
      setError,
      method: "GET",
      path: "unitservice",
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      UnitServices
      {isAdding && (
        <AddModel
          textDetails={[
            { name: "name_arabic", nameShown: "name_arabic" },
            { name: "name_english", nameShown: "name_english" },
            { name: "general_work_area", nameShown: "general_work_area" },
            { name: "general_work_area", nameShown: "general_work_area" },
          ]}
          selectDetailsManually={[
            {
              name: "status",
              nameShown: "Status",
              options: [
                { name: "Active", nameShown: "Active" },
                { name: "Not active", nameShown: "Not active" },
              ],
            },
          ]}
          path={"unitservice"}
          setIsAdding={setIsAdding}
          fetchData={fetchData}
        />
      )}
      {editting && (
        <EditModel
          textDetails={[{ name: "name", nameShown: "name" }]}
          selectDetailsManually={[
            {
              name: "status",
              nameShown: "Status",
              options: [
                { name: "Active", nameShown: "Active" },
                { name: "Not active", nameShown: "Not active" },
              ],
            },
          ]}
          path={"unitservice"}
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
            path={"unitservice"}
            h2items={["name"]}
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
export default connect(mapStateToProps, mapDispatchToProps)(UnitServices);
