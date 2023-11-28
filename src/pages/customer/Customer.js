import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Drugsprescriptions from "../../components/customers/Drugsprescriptions";
import Patientappointment from "../../components/customers/Patientappointment";
import axiosHandler from "../../handlers/axiosHandler";
import AddModel from "../../handlers/modelComponents/AddModel";
import EditModel from "../../handlers/modelComponents/EditModel";
import ModelCard from "../../handlers/modelComponents/ModelCard";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const Customer = (props) => {
  const navigate = useNavigate()
  const profile = () => {
    navigate("/pofile")
  };
 
  return(
    
    <div>
      <FaRegUserCircle onClick={profile} className="profile" />
      <br/>
      <br/>
      <img className="QR" alt="qrcode" src="https://lh3.googleusercontent.com/Tw6gyt9GRZU0ZSBXh51PCWWO4K_dcbR31iQ6cA1st1Iwd9rbuPCPe-YUVhpVHbm1v2UteZnbjNsiF88eOjRzwPhrwDUR0zaXpnrfBzWTwL5mBA3alX4LXRa4nQkfEbtLRA2xqDpuQx1dq1bldq9qJ_lXFfsxCHv36ZWWSf0MAHOLt9lz3TSltoHINhNGNw"/>
      <br/>
      <br/>
      <Drugsprescriptions/>
      <br/>
      <Patientappointment/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
  model: state.model,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Customer);