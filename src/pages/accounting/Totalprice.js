import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../handlers/axiosHandler";
import AddModel from "../../handlers/modelComponents/AddModel";
import EditModel from "../../handlers/modelComponents/EditModel";
import ModelCard from "../../handlers/modelComponents/ModelCard";


const Totalprice = (props) => {
    const [data, setData] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editting, setEditting] = useState("");
    const [error, setError] = useState();
    const fetchData = async () => {
      await axiosHandler({
        setData,
        setError,
        method: "GET",
        path: "totalprice",
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
              name: "total_offer_amount",
              nameShown: "total offer amount",
              type: "number"
            },
            {
              name: "Offer_date",
              nameShown: "Offer_date",
              type: "date"
            },
          ]}
          path={"totalprice"}
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
              name: "total_offer_amount",
              nameShown: "total offer amount",
              type: "number"
            },
            {
              name: "Offer_date",
              nameShown: "Offer_date",
              type: "date"
            },
          ]}
          path={`totalprice`}
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
            path={"totalprice"}
            h2items={["total_offer_amount", "Offer_date", "unit_service"]}
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
  export default connect(mapStateToProps, mapDispatchToProps)(Totalprice);
  