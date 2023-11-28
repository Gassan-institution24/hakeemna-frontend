import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import axiosHandler from "../../handlers/axiosHandler";
import AddModel from "../../handlers/modelComponents/AddModel";
import EditModel from "../../handlers/modelComponents/EditModel";
import ModelCard from "../../handlers/modelComponents/ModelCard";
import { FaHome } from "react-icons/fa";
import { RiCustomerService2Line } from "react-icons/ri";
const Profile = (props) => {
  const [contactform, setContactform] = useState(false);
  const [form, setForm] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setForm(props?.user?.data);
  }, [props.user]);
  const home = () => {
    navigate("/customer");
  };
  const showform = () => {
    setContactform(!contactform);
  };
  console.log(form);
  return (
    <div>  
      <FaHome onClick={home} className="profile" />
      <RiCustomerService2Line onClick={showform} className="profile" />
      <br />
      <br />
      <h1>medical histoy</h1>
      <hr/>
      <h1>history</h1>
      <hr/>
      <br />
      <br />
      <h1>personal info</h1>
      <p>{form?.email}</p>
      <hr />
      <br />
      {contactform && 
      <>
        <label>subject</label>
        <input />
        <button>send</button>
      </>
     
      }

   
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  model: state.model,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
