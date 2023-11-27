import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../../handlers/axiosHandler";
import AddModel from "../../../handlers/modelComponents/AddModel";
import EditModel from "../../../handlers/modelComponents/EditModel";
import ModelCard from "../../../handlers/modelComponents/ModelCard";

function Cities(props) {
  const [data, setData] = useState();
  const [isAdding, setIsAdding] = useState(false);
  const [editting, setEditting] = useState("");
  const [error, setError] = useState();

  const fetchData = async () => {
    await axiosHandler({
      setData,
      setError,
      method: "GET",
      path: "cities",
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      cities
      {isAdding && (
        <AddModel
          textDetails={[
            { name: "name_arabic", nameShown: "name_arabic" },
            { name: "name_english", nameShown: "name_english" },
          ]}
          selectDetails={[
            {
              name: "country",
              nameShown: "unit country",
              path: "countries",
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
          path={"cities"}
          setIsAdding={setIsAdding}
          fetchData={fetchData}
        />
      )}
      {editting && (
        <EditModel
        textDetails={[
            { name: "name_arabic", nameShown: "name_arabic" },
            { name: "name_english", nameShown: "name_english" },
          ]}
          selectDetails={[
            {
              name: "country",
              nameShown: "unit country",
              path: "countries",
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
          path={"cities"}
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
            path={"cities"}
            h2items={["name_arabic", "name_english",'country']}
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
export default connect(mapStateToProps, mapDispatchToProps)(Cities);
