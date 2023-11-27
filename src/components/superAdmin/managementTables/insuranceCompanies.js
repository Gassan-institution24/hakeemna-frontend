import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../../handlers/axiosHandler";
import AddModel from "../../../handlers/AddModel";
import EditModel from "../../../handlers/EditModel";
import ModelCard from "../../../handlers/ModelCard";

function InsuranceCompanies(props) {
  const [data, setData] = useState();
  const [isAdding, setIsAdding] = useState(false);
  const [editting, setEditting] = useState("");
  const [error, setError] = useState();

  const fetchData = async () => {
    await axiosHandler({
      setData,
      setError,
      method: "GET",
      path: "insurance/companies",
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      InsuranceCompanies
      {isAdding && (
        <AddModel
          textDetails={[
            { name: "name", nameShown: "name" },
            { name: "webpage", nameShown: "webpage" },
            { name: "info", nameShown: "info" },
            { name: "phone", nameShown: "phone",type:'number' },
            { name: "address", nameShown: "address" },
          ]}
          selectDetails={[
            {
              name: "US_type",
              nameShown: "US_type",
              path: "ustypes",
            },
            {
              name: "type",
              nameShown: "type",
              path: "insurance/types",
            },
          ]}
          selectDetailsRelayed={[
            {
              name: "country",
              nameShown: "country",
              path: "countries",
            },
          ]}
          selectDetailsRelated={[
            {
              name: "city",
              nameShown: "city",
              path: "cities/country",
            },
          ]}
          selectDetailsManually={[
            {
              name: "status",
              nameShown: "Status",
              options: [
                { name: "active", nameShown: "Active" },
                { name: "not active", nameShown: "Not active" },
              ],
            },
          ]}
          path={"insurance/companies"}
          setIsAdding={setIsAdding}
          fetchData={fetchData}
        />
      )}
      {editting && (
        <EditModel
        textDetails={[
            { name: "name", nameShown: "name" },
            { name: "webpage", nameShown: "webpage" },
            { name: "info", nameShown: "info" },
            { name: "phone", nameShown: "phone",type:'number' },
            { name: "address", nameShown: "address" },
          ]}
          selectDetails={[
            {
              name: "US_type",
              nameShown: "US_type",
              path: "ustypes",
            },
            {
              name: "type",
              nameShown: "type",
              path: "insurance/types",
            },
          ]}
          selectDetailsRelayed={[
            {
              name: "country",
              nameShown: "country",
              path: "countries",
            },
          ]}
          selectDetailsRelated={[
            {
              name: "city",
              nameShown: "city",
              path: "cities/country",
            },
          ]}
          selectDetailsManually={[
            {
              name: "status",
              nameShown: "Status",
              options: [
                { name: "active", nameShown: "Active" },
                { name: "not active", nameShown: "Not active" },
              ],
            },
          ]}
          path={"insurance/companies"}
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
            path={"insurance/companies"}
            h2items={["name", "webpage", "info",'phone','address']}
          />
        );
      })}
      {JSON.stringify(data)}
      {JSON.stringify(props.model)}
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
  model: state.model,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(InsuranceCompanies);
