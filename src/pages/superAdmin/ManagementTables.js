import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Countries from "../fixedData/locationInfo/countries";
import Cities from "../fixedData/locationInfo/cities";
import UnitServices from "../../components/superAdmin/managementTables/unitServices";
import Departments from "../../components/superAdmin/managementTables/departments";
import Activities from "../../components/superAdmin/managementTables/activities";
import AppointmentTypes from "../shared/AppointmentTypes";
import InsuranceCompanies from "../../components/superAdmin/managementTables/insuranceCompanies";
function ManagementTables(props) {
  return(
    <div>
      {/* <Countries/>
      <Cities/>
      <UnitServices/>
      <Departments/>
      <Activities/>
      <AppointmentTypes/> */}
      <InsuranceCompanies/>
      
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
  model: state.model,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(ManagementTables);
