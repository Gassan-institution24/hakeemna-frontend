import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Countries from "../fixedData/locationInfo/countries";
import Cities from "../fixedData/locationInfo/cities";
function ManagementTables(props) {
  return(
    <div>
      <Countries/>
      <Cities/>
      
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
  model: state.model,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(ManagementTables);
