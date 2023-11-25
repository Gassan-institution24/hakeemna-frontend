import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../handlers/axiosHandler";
import AddModel from "../../handlers/AddModel";
import EditModel from "../../handlers/EditModel";
import ModelCard from "../../handlers/ModelCard";

const Licensmovment = (props) => {
  const [data, setData] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editting, setEditting] = useState("");
  const [error, setError] = useState();
  const fetchData = async () => {
    await axiosHandler({
      setData,
      setError,
      method: "GET",
      path: "licensemovements",
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      licensemovements
      {isAdding && (
        <AddModel
          textDetails={[
            {
              name: "Subscription_period_offer_name",
              nameShown: "Subscription_period_offer_name",
              type: "string",
            },
          ]}
          path={"licensemovements"}
          selectDetails={[
            {
              name: "unit_service",
              nameShown: "unit service",
              path: "unitservice",
            },
          ]}
          setIsAdding={setIsAdding}
          fetchData={fetchData}
        />
      )}
      {editting && (
        <EditModel
          textDetails={[
            {
              name: "Subscription_period_offer_name",
              nameShown: "Subscription_period_offer_name",
              type: "string",
            },
          ]}
          path={`licensemovements`}
          selectDetails={[
            {
              name: "unit_service",
              nameShown: "unit service",
              path: "unitservice",
            },
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
            path={"licensemovements"}
            h2items={["movements_year", "unit_service"]}
          />
        );
      })}
      {JSON.stringify(data)}
      {JSON.stringify(props.model)}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  model: state.model,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Licensmovment);

