import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../handlers/axiosHandler";
import AddModel from "../../handlers/modelComponents/AddModel";
import EditModel from "../../handlers/modelComponents/EditModel";
import ModelCard from "../../handlers/modelComponents/ModelCard";
const Patientappointment = (props) => {
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
        path: `appointments/customer/${user.customer?._id}`,
      });
    }
  };
  useEffect(() => {
    fetchData();
  }, [props.user]);
  return (
    <div>
      <h1>current appointments</h1>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>start time</th>
            <th>end time</th>
          </tr>
        </thead>

        {data?.map((one, idx) => {
          return (
            <tbody key={idx}>
              <tr>
                <td>{one?.name}</td>
                <td>{one?.start_time}</td>
                <td>{one?.end_time}</td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  model: state.model,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Patientappointment);
