import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../handlers/axiosHandler";
import AddModel from "../../handlers/AddModel";
import EditModel from "../../handlers/EditModel";
import ModelCard from "../../handlers/ModelCard";
import { FaRegUserCircle } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
const Drugsprescriptions = (props) => {
  const [data, setData] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editting, setEditting] = useState("");
  const [error, setError] = useState();
  const fetchData = async () => {
    if (props.user.data) {
      const user = await props.user.data;
      await axiosHandler({
        setData,
        setError,
        method: "GET",
        path: `drugs/${user.customer?._id}`,
      });
    }
  };
  useEffect(() => {
    fetchData();
  }, [props.user]);

  const profile = () => {
    alert("profile");
  };
  const home = () => {
    alert("home");
  };

  return (
    <div>
      <FaRegUserCircle onClick={profile} className="profile" />
      <br/>
      <br/>
      <FaHome onClick={home} className="profile" />
      <br/>
      <br/>
      <div className="medicines">
        <h1>current medicines</h1>
        {data?.map((one, idx) => {
          return one?.medicines?.map((one, i) => {
            return (
              <ModelCard
                key={i}
                fetchData={fetchData}
                setEditting={setEditting}
                one={one}
                path={"drugs"}
                h2items={["trade_name"]}
                hideButtons={true}
              />
            );
          });
        })}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  model: state.model,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Drugsprescriptions);
