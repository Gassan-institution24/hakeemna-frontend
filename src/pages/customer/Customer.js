import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../handlers/axiosHandler";
import AddModel from "../../handlers/AddModel";
import EditModel from "../../handlers/EditModel";
import ModelCard from "../../handlers/ModelCard";


const Customer = (props) => {
  const [data, setData] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editting, setEditting] = useState("");
    const [error, setError] = useState();
    const fetchData = async () => {
      await axiosHandler({
        setData,
        setError,
        method: "GET",
        path: "customer",
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
              name: "first_name",
              nameShown: "first name",
            },
            {
              name: "second_name",
              nameShown: "second name",
            },
          ]}
          path={"customer"}
          selectDetails={[
            { name: "nationality", nameShown: "nationality", path: "countries" },
          ]}
          setIsAdding={setIsAdding}
          fetchData={fetchData}
        />
      )}
      {editting && (
        <EditModel
          textDetails={[
            {
              name: "first_name",
              nameShown: "first name",
            },
            {
              name: "second_name",
              nameShown: "second name",
            },
          ]}
          path={`customer`}
          selectDetails={[
            { name: "nationality", nameShown: "nationality", path: "countries" },
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
            path={"customer"}
            h2items={["first_name", "second_name", "nationality"]}
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
export default connect(mapStateToProps, mapDispatchToProps)(Customer);