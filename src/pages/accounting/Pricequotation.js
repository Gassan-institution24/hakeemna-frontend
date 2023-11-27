import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../handlers/axiosHandler";
import AddModel from "../../handlers/modelComponents/AddModel";
import EditModel from "../../handlers/modelComponents/EditModel";
import ModelCard from "../../handlers/modelComponents/ModelCard";

const Pricequotation = (props) => {
    const [data, setData] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editting, setEditting] = useState("");
    const [error, setError] = useState();
    const fetchData = async () => {
      await axiosHandler({
        setData,
        setError,
        method: "GET",
        path: "pricequotation",
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
              name: "Place_of_service",
              nameShown: "Measurement name",
            },
            {
              name: "Price_per_unit",
              nameShown: "Measurement type",
            },
          ]}
          path={"pricequotation"}
          selectDetails={[
            { name: "unit_service", nameShown: "unit service", path: "unitservice" },
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
              nameShown: "Measurement name",
            },
            {
              name: "Price_per_unit",
              nameShown: "Measurement type",
            },
          ]}
          path={`pricequotation`}
          selectDetails={[
            { name: "unit_service", nameShown: "unit service", path: "unitservice" },
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
            path={"pricequotation"}
            h2items={["Place_of_service", "Price_per_unit", "unit_service"]}
          />
        );
      })}
      
      
    </div>
  )
}

const mapStateToProps = (state) => ({
    user: state.user,
    model: state.model,
  });
  const mapDispatchToProps = {};
  export default connect(mapStateToProps, mapDispatchToProps)(Pricequotation);


  
