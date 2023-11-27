import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../handlers/axiosHandler";
import AddModel from "../../handlers/AddModel";
import EditModel from "../../handlers/EditModel";
import ModelCard from "../../handlers/ModelCard";

function AppointmentsTypes(props) {
  const [data, setData] = useState();
  const [isAdding, setIsAdding] = useState(false);
  const [editting, setEditting] = useState("");
  const [error, setError] = useState();

  const fetchData = async () => {
    await axiosHandler({
      setData,
      setError,
      method: "GET",
      path: "appointments/types",
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      appointmentstypes
      {isAdding && (
        <AddModel
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
          path={"appointments/types"}
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
          path={"appointments/types"}
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
            path={"appointments/types"}
            h2items={["name"]}
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
export default connect(mapStateToProps, mapDispatchToProps)(AppointmentsTypes);
