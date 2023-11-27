import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../handlers/axiosHandler";
import AddModel from "../../handlers/AddModel";
import EditModel from "../../handlers/EditModel";
import ModelCard from "../../handlers/ModelCard";


const Providedservicemovement = (props) => {
    const [data, setData] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editting, setEditting] = useState("");
    const [error, setError] = useState();
    const fetchData = async () => {
      await axiosHandler({
        setData,
        setError,
        method: "GET",
        path: "providedservice",
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
              name: "place_of_service",
              nameShown: "place of service",
            },
            {
              name: "price_per_unit",
              nameShown: "price per unit",
              type: "number"
            },
          ]}
          path={"providedservice"}
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
              name: "place_of_service",
              nameShown: "place of service",
            },
            {
              name: "price_per_unit",
              nameShown: "price per unit",
              type: "number"
            },
          ]}
          path={`providedservice`}
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
            path={"providedservice"}
            h2items={["place_of_service", "price_per_unit", "unit_service"]}
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
  export default connect(mapStateToProps, mapDispatchToProps)(Providedservicemovement);
