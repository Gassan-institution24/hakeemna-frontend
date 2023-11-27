import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../../handlers/axiosHandler";
import AddModel from "../../../handlers/modelComponents/AddModel";
import EditModel from "../../../handlers/modelComponents/EditModel";
import ModelCard from "../../../handlers/modelComponents/ModelCard";

function Currency(props) {
  const [data, setData] = useState();
  const [isAdding, setIsAdding] = useState(false);
  const [editting, setEditting] = useState("");
  const [error, setError] = useState();

  const fetchData = async () => {
    await axiosHandler({
      setData,
      setError,
      method: "GET",
      path: "currency",
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      currency
      {isAdding && (
        <AddModel
          textDetails={[
            { name: "name_arabic", nameShown: "name_arabic" },
            { name: "name_english", nameShown: "name_english" },
            { name: "symbol", nameShown: "symbol" },
            {
              name: "relation_to_dollar",
              nameShown: "relation_to_dollar",
              type: "number",
            },
          ]}
          path={"currency"}
          setIsAdding={setIsAdding}
          fetchData={fetchData}
        />
      )}
      {editting && (
        <EditModel
        textDetails={[
            { name: "name_arabic", nameShown: "name_arabic" },
            { name: "name_english", nameShown: "name_english" },
            { name: "symbol", nameShown: "symbol" },
            {
              name: "relation_to_dollar",
              nameShown: "relation_to_dollar",
              type: "number",
            },
          ]}
          path={"currency"}
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
            path={"currency"}
            h2items={["name_arabic", "name_english"]}
            pitems={["symbol", "relation_to_dollar"]}
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
export default connect(mapStateToProps, mapDispatchToProps)(Currency);
