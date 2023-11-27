import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../handlers/axiosHandler";
import AddModel from "../../handlers/modelComponents/AddModel";
import EditModel from "../../handlers/modelComponents/EditModel";
import ModelCard from "../../handlers/modelComponents/ModelCard";
const Customeranalysis = (props) => {
  const [data, setData] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editting, setEditting] = useState("");
  const [error, setError] = useState();
  const fetchData = async () => {
    await axiosHandler({
      setData,
      setError,
      method: "GET",
      path: "customeranalysis",
    });
  };
  useEffect(() => {
    fetchData();
  }, []);
return (
  <div className="back">
    {isAdding && (
      <AddModel
        textDetails={[
          {
            name: "file",
            nameShown: "file",
          },
          {
            name: "ip_address_user_creation",
            nameShown: "ip address usercreation",
          },
        ]}
        path={"customeranalysis"}
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
            name: "file",
            nameShown: "file",
          },
          {
            name: "ip_address_user_creation",
            nameShown: "ip address usercreation",
          },
        ]}
        path={`customeranalysis`}
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
          path={"customeranalysis"}
          h2items={["file", "ip_address_user_creation", "nationality"]}
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
export default connect(mapStateToProps, mapDispatchToProps)(Customeranalysis);