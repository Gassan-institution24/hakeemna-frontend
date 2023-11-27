import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../../handlers/axiosHandler";
import AddModel from "../../../handlers/AddModel";
import EditModel from "../../../handlers/EditModel";
import ModelCard from "../../../handlers/ModelCard";

function UnitServices(props) {
  const [data, setData] = useState();
  const [isAdding, setIsAdding] = useState(false);
  const [editting, setEditting] = useState("");
  const [error, setError] = useState();

  const fetchData = async () => {
    await axiosHandler({
      setData,
      setError,
      method: "GET",
      path: "unitservice",
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      UnitServices
      {isAdding && (
        <AddModel
          textDetails={[
            { name: "name_arabic", nameShown: "name_arabic" },
            { name: "name_english", nameShown: "name_english" },
            { name: "general_work_area", nameShown: "general_work_area" },
            {
              name: "subscription_period_months",
              nameShown: "subscription_period_months",
              type: "number",
            },
            { name: "tax", nameShown: "tax" },
            { name: "identification_num", nameShown: "identification_num" },
            { name: "address", nameShown: "address" },
            { name: "email", nameShown: "email" },
            { name: "web_page", nameShown: "web_page" },
            { name: "company_logo", nameShown: "company_logo" },
            { name: "phone", nameShown: "phone" },
            { name: "mobile_num", nameShown: "mobile_num" },
            { name: "introduction_letter", nameShown: "introduction_letter" },
            { name: "other_information", nameShown: "other_information" },
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
            {
              name: "sector_type",
              nameShown: "sector type",
              options: [
                { name: "public", nameShown: "public" },
                { name: "privet", nameShown: "privet" },
                { name: "charity", nameShown: "charity" },
              ],
            },
          ]}
          selectDetails={[
            {
              name: "speciality",
              nameShown: "speciality",
              path: "specialities",
            },
          ]}
          multiSelectDetails={[
            { name: "package", nameShown: "package", path: "backages" },
          ]}
          path={"unitservice"}
          setIsAdding={setIsAdding}
          fetchData={fetchData}
        />
      )}
      {editting && (
        <EditModel
          textDetails={[
            { name: "name_arabic", nameShown: "name_arabic" },
            { name: "name_english", nameShown: "name_english" },
            { name: "general_work_area", nameShown: "general_work_area" },
            {
              name: "subscription_period_months",
              nameShown: "subscription_period_months",
              type: "number",
            },
            { name: "tax", nameShown: "tax" },
            { name: "identification_num", nameShown: "identification_num" },
            { name: "address", nameShown: "address" },
            { name: "email", nameShown: "email" },
            { name: "web_page", nameShown: "web_page" },
            { name: "company_logo", nameShown: "company_logo" },
            { name: "phone", nameShown: "phone" },
            { name: "mobile_num", nameShown: "mobile_num" },
            { name: "introduction_letter", nameShown: "introduction_letter" },
            { name: "other_information", nameShown: "other_information" },
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
            {
              name: "sector_type",
              nameShown: "sector type",
              options: [
                { name: "public", nameShown: "public" },
                { name: "privet", nameShown: "privet" },
                { name: "charity", nameShown: "charity" },
              ],
            },
          ]}
          selectDetails={[
            {
              name: "speciality",
              nameShown: "speciality",
              path: "specialities",
            },
          ]}
          multiSelectDetails={[
            { name: "packages", nameShown: "packages", path: "backages" },
          ]}
          path={"unitservice"}
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
            path={"unitservice"}
            h2items={[
              "name_arabic",
              "name_english",
              "general_work_area",
              "subscription_period_months",
              "tax",
              "identification_num",
              "address",
              "email",
              "web_page",
              "company_logo",
              "phone",
              "mobile_num",
              "introduction_letter",
              "other_information",
            ]}
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
export default connect(mapStateToProps, mapDispatchToProps)(UnitServices);
