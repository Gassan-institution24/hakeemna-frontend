import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../handlers/axiosHandler";
import AddModel from "../../handlers/AddModel";
import EditModel from "../../handlers/EditModel";
import ModelCard from "../../handlers/ModelCard";

const Stockmanagement = (props) => {
  const [data, setData] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editting, setEditting] = useState("");
  const [error, setError] = useState();
  const fetchData = async () => {
    await axiosHandler({
      setData,
      setError,
      method: "GET",
      path: "stockmanagement",
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
              name: "test",
              nameShown: "test",
            },
            {
              name: "code",
              nameShown: "code",
              type : "number"
            },
          ]}
          path={"stockmanagement"}
          setIsAdding={setIsAdding}
          fetchData={fetchData}
        />
      )}
      {editting && (
        <EditModel
          textDetails={[
            {
              name: "test",
              nameShown: "test",
            },
            {
              name: "code",
              nameShown: "code",
              type : "number"
            },
          ]}
          path={`stockmanagement`}
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
            path={"stockmanagement"}
            h2items={["test"]}
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
export default connect(mapStateToProps, mapDispatchToProps)(Stockmanagement);
