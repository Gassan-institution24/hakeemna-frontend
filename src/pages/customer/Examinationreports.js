import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../handlers/axiosHandler";
import AddModel from "../../handlers/AddModel";
import EditModel from "../../handlers/EditModel";
import ModelCard from "../../handlers/ModelCard";



const Examinationreports = (props) => {
  const [data, setData] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editting, setEditting] = useState("");
  const [error, setError] = useState();
  const fetchData = async () => {
    await axiosHandler({
      setData,
      setError,
      method: "GET",
      path: "examination",
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
            name: "Medical_sick_leave_start",
            nameShown: "Medical sick leave start",
            type: "date"
          },
          {
            name: "Medical_sick_leave_end",
            nameShown: "Medical sick leave end",
            type: "date"
          },
        ]}
        path={"examination"}
        selectDetails={[
          { name: "activity", nameShown: "activity", path: "activities" },
        ]}
        setIsAdding={setIsAdding}
        fetchData={fetchData}
      />
    )}
    {editting && (
      <EditModel
        textDetails={[
          {
            name: "Medical_sick_leave_start",
            nameShown: "Medical sick leave start",
            type: "date"
          },
          {
            name: "Medical_sick_leave_end",
            nameShown: "Medical sick leave end",
            type: "date"
          },
        ]}
        path={`examination`}
        selectDetails={[
          { name: "activity", nameShown: "activity", path: "activities" },
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
          path={"examination"}
          h2items={["Medical_sick_leave_start", "Medical_sick_leave_end", "activity"]}
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
export default connect(mapStateToProps, mapDispatchToProps)(Examinationreports);