import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../handlers/axiosHandler";
import AddModel from "../../handlers/AddModel";
import EditModel from "../../handlers/EditModel";
import ModelCard from "../../handlers/ModelCard";


const Paymentmethod = (props) => {
  const [data, setData] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editting, setEditting] = useState("");
  const [error, setError] = useState();
  const fetchData = async () => {
    await axiosHandler({
      setData,
      setError,
      method: "GET",
      path: "paymentmethod",
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
            name: "Method_name",
            nameShown: "Measurement name",
          },
          {
            name: "Method_code",
            nameShown: "Method code",
            type: "number"
          },
        ]}
        path={"paymentmethod"}
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
            name: "Method_name",
            nameShown: "Measurement name",
          },
          {
            name: "Method_code",
            nameShown: "Method_code",
            type: "number"
          },
        ]}
        path={`paymentmethod`}
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
          path={"paymentmethod"}
          h2items={["Method_name", "Method_code", "unit_service"]}
        />
      );
    })}
    
    
  </div>
)
}

export default Paymentmethod
