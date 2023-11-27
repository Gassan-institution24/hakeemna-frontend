import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Drugsprescriptions from "../../components/customers/Drugsprescriptions";

const Customer = (props) => {
  return(
    <div>
      <Drugsprescriptions/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
  model: state.model,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Customer);