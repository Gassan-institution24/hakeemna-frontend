import React, { useState } from "react";
import { connect } from "react-redux";
import Model from "../../handlers/Model";
function ManagementTables(props) {
  return (
    <div>
      <Model
        path={"activities"}
        textDetails={[
          { name: "name", nameShown: "name" },
          { name: "details", nameShown: "details" },
        ]}
        selectDetails={[
          {
            name: "unit_service",
            nameShown: "unit service",
            path: "unitservice",
          },
          {
            name: "department",
            nameShown: "department",
            path: "departments",
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
        h2items={["name"]}
        pitems={["details"]}
      />
      <Model
        path={"analysis"}
        textDetails={[
          { name: "name", nameShown: "name" },
          { name: "description", nameShown: "description" },
        ]}
        h2items={["name"]}
        pitems={["description"]}
      />
      <Model
        path={"cities"}
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
        h2items={["name_arabic", "name_english"]}
        pitems={["country"]}
      />
      <Model
        path={"countries"}
        textDetails={[
          { name: "name_arabic", nameShown: "name_arabic" },
          { name: "name_english", nameShown: "name_english" },
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
        h2items={["name_arabic", "name_english"]}
      />
      <Model
        path={"currency"}
        textDetails={[
          { name: "name_arabic", nameShown: "name_arabic" },
          { name: "name_english", nameShown: "name_english" },
          { name: "symbol", nameShown: "symbol" },
          {
            name: "relation_to_dollar",
            nameShown: "relation_to_dollar",
            type: "number",
          },
        ]}
        h2items={["name_arabic", "name_english"]}
        pitems={["symbol", "relation_to_dollar"]}
      />
      <Model
        path={"departments"}
        textDetails={[
          { name: "name_arabic", nameShown: "name_arabic" },
          { name: "name_english", nameShown: "name_english" },
          { name: "general_info", nameShown: "general_info" },
        ]}
        selectDetails={[
          {
            name: "unit_service",
            nameShown: "unit service",
            path: "unitservice",
          },
        ]}
        h2items={["name_arabic", "name_english"]}
        pitems={["general_info"]}
      />
      <Model
        path={"diets"}
        textDetails={[
          { name: "name", nameShown: "name" },
          { name: "description", nameShown: "description" },
          { name: "duration", nameShown: "duration" },
        ]}
        h2items={["name"]}
        pitems={["description", "duration"]}
      />
      <Model
        path={"diseases"}
        textDetails={[
          { name: "name", nameShown: "name" },
          { name: "description", nameShown: "description" },
        ]}
        selectDetails={[
          {
            name: "category",
            nameShown: "category",
            path: "medcategories",
          },
        ]}
        multiSelectDetails={[
          {
            name: "symptoms",
            nameShown: "symptoms",
            path: "symptoms",
          },
        ]}
        h2items={["name"]}
        pitems={["description", "symptoms", "category"]}
      />
      <Model
        path={"insurance/companies"}
        textDetails={[
          { name: "name", nameShown: "name" },
          { name: "webpage", nameShown: "webpage" },
          { name: "info", nameShown: "info" },
          { name: "phone", nameShown: "phone", type: "number" },
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
        h2items={["name"]}
        pitems={["webpage", "info", "phone", "address"]}
      />
      <Model
        path={"medcategories"}
        textDetails={[
          { name: "name", nameShown: "name" },
          { name: "description", nameShown: "description" },
        ]}
        h2items={["name"]}
        pitems={["description"]}
      />
      <Model
        path={"medicines"}
        textDetails={[
          { name: "trade_name", nameShown: "trade_name" },
          { name: "concentration", nameShown: "concentration" },
          { name: "agent", nameShown: "agent" },
          { name: "price_1", nameShown: "price_1", type: "number" },
          { name: "price_2", nameShown: "price_2", type: "number" },
          { name: "ATCCODE", nameShown: "ATCCODE" },
          { name: "packaging", nameShown: "packaging" },
          { name: "scientific_name", nameShown: "scientific_name" },
          { name: "barcode", nameShown: "barcode" },
          { name: "packaging", nameShown: "packaging" },
          { name: "contraindication", nameShown: "contraindication" },
        ]}
        selectDetailsManually={[
          {
            name: "status",
            nameShown: "status",
            options: [
              { name: "active", nameShown: "active" },
              { name: "restrict", nameShown: "restrict" },
            ],
          },
        ]}
        multiSelectDetails={[
          {
            name: "side_effects",
            nameShown: "side_effects",
            path: "symptoms",
          },
        ]}
        selectDetails={[
          {
            name: "family",
            nameShown: "family",
            path: "drugfamilies",
          },
        ]}
        h2items={["trade_name", "scientific_name"]}
        pitems={[
          "concentration",
          "agent",
          "price_1",
          "price_2",
          "ATCCODE",
          "packaging",
          "barcode",
          "packaging",
          "contraindication",
        ]}
      />
      <Model
        path={"drugfamilies"}
        textDetails={[
          { name: "name", nameShown: "name" },
          { name: "description", nameShown: "description" },
        ]}
        h2items={["name"]}
        pitems={["description"]}
      />
      <Model
        path={"specialities"}
        textDetails={[
          { name: "name_arabic", nameShown: "name_arabic" },
          { name: "name_english", nameShown: "name_english" },
          { name: "description", nameShown: "description" },
        ]}
        h2items={["name_arabic", "name_english"]}
        pitems={["description"]}
      />
      <Model
        path={"subspecialities"}
        textDetails={[
          { name: "name_arabic", nameShown: "name_arabic" },
          { name: "name_english", nameShown: "name_english" },
          { name: "description", nameShown: "description" },
        ]}
        selectDetails={[
          {
            name: "specialty",
            nameShown: "specialty",
            path: "specialities",
          },
        ]}
        h2items={["name_arabic", "name_english"]}
        pitems={["description", "specialty"]}
      />
      <Model
        path={"surgeries"}
        textDetails={[
          { name: "name", nameShown: "name" },
          { name: "description", nameShown: "description" },
        ]}
        multiSelectDetails={[
          {
            name: "diseases",
            nameShown: "diseases",
            path: "diseases",
          },
        ]}
        h2items={["name"]}
        pitems={["description", "diseases"]}
      />
      <Model
        path={"symptoms"}
        textDetails={[
          { name: "name", nameShown: "name" },
          { name: "description", nameShown: "description" },
        ]}
        h2items={["name"]}
        pitems={["description"]}
      />
      <Model
        path={"unitservice"}
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
        h2items={["name_arabic", "name_english"]}
        pitems={[
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
      <Model
        path={"appointments/types"}
        textDetails={[{ name: "name", nameShown: "name" }]}
        selectDetailsManually={[
          {
            name: "status",
            nameShown: "Status",
            options: [
              { name: "Active", nameShown: "Active" },
              { name: "Not active", nameShown: "Not active" },
            ],
          },
        ]}
        h2items={["name"]}
      />
      <Model
        path={"paymentmethod"}
        textDetails={[{ name: "name", nameShown: "name" }]}
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
        h2items={["name"]}
      />
      <Model
        path={"employeetypes"}
        textDetails={[{ name: "name", nameShown: "name" }]}
        selectDetails={[
          {
            name: "unit_service",
            nameShown: "unit_service",
            path: "unitservice",
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
        h2items={["name"]}
        pitems={["status"]}
      />
      <Model
        path={"ustypes"}
        textDetails={[
          { name: "name_arabic", nameShown: "name_arabic" },
          { name: "name_English", nameShown: "name_English" },
        ]}
        h2items={["name_arabic", "name_English"]}
      />
      <Model
        path={"wshifts"}
        textDetails={[
          { name: "name", nameShown: "name" },
          { name: "start_date", nameShown: "start_date", type: "time" },
          { name: "end_date", nameShown: "end_date", type: "time" },
        ]}
        selectDetails={[
          {
            name: "unit_service",
            nameShown: "unit_service",
            path: "unitservice",
          },
        ]}
        h2items={["name", "start_date", "end_date", "unit_service"]}
      />
      <Model
        path={"servicetypes"}
        textDetails={[
          { name: "name_arabic", nameShown: "name_arabic" },
          { name: "name_English", nameShown: "name_English" },
          { name: "Place_of_service", nameShown: "Place_of_service" },
          {
            name: "Price_per_unit",
            nameShown: "Price_per_unit",
            type: "number",
          },
          { name: "Filter_2", nameShown: "Filter_2" },
          { name: "Filter_3", nameShown: "Filter_3" },
        ]}
        selectDetails={[
          {
            name: "unit_service",
            nameShown: "unit_service",
            path: "unitservice",
          },
          {
            name: "work_shift",
            nameShown: "work_shift",
            path: "wshifts",
          },
          {
            name: "Measurement_type",
            nameShown: "Measurement_type",
            path: "measurementtypes",
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
        h2items={[
          "name_arabic",
          "name_English",
        ]}
        pitems={[
          "Place_of_service",
          "Price_per_unit",
          "Filter_2",
          "Filter_3",
        ]}
      />
      <Model
        path={"measurementtypes"}
        textDetails={[
          { name: "name", nameShown: "name" },
          { name: "symbol", nameShown: "symbol" },
          { name: "Filter_2", nameShown: "Filter_2" },
          { name: "Filter_3", nameShown: "Filter_3" },
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
        h2items={[
          "name",
          "symbol",
        ]}
        pitems={[
          "Filter_2",
          "Filter_3",
        ]}
      />
      <Model
        path={"hospital"}
        textDetails={[
          { name: "name", nameShown: "name" },
          { name: "symbol", nameShown: "symbol" },
          { name: "Filter_2", nameShown: "Filter_2" },
          { name: "Filter_3", nameShown: "Filter_3" },
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
        h2items={[
          "name",
          "symbol",
        ]}
        pitems={[
          "Filter_2",
          "Filter_3",
        ]}
      />

      {/* <Model
        path={"addedvaluetax"}
        textDetails={[
          { name: "place_of_sevice", nameShown: "place_of_sevice" },
          { name: "provided_service_year", nameShown: "provided_service_year",type:'year' },
        ]}
        selectDetailsManually={[
          {
            name: "movements_type",
            nameShown: "movements_type",
            options: [
              { },
              { name: "expences", nameShown: "expences" },
              { name: "income", nameShown: "income" },
            ],
          },
          {
            name: "declared",
            nameShown: "declared",
            options: [
              {},
              { name: "yes", nameShown: "yes" },
              { name: "no", nameShown: "no" },
            ],
          },
        ]}
        h2items={["name"]}
      /> */}
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
  model: state.model,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(ManagementTables);
