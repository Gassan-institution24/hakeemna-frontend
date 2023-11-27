import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axiosHandler from "../../handlers/axiosHandler";
import AddModel from "../../handlers/AddModel";
import EditModel from "../../handlers/EditModel";
import ModelCard from "../../handlers/ModelCard";

function Appointments(props) {
  const [data, setData] = useState();
  const [isAdding, setIsAdding] = useState(false);
  const [editting, setEditting] = useState("");
  const [error, setError] = useState();

  const fetchData = async () => {
    await axiosHandler({
      setData,
      setError,
      method: "GET",
      path: "appointments",
    });
  };
  //console.log(props)
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      Appointments
      {isAdding && (
        <AddModel
          textDetails={[
            { name: "name", nameShown: "name" },
            { name: "description", nameShown: "Description" },
            { name: "date", nameShown: "date",type:'date'},
            { name: "start_time", nameShown: "start time",type:'time'},
            { name: "end_time", nameShown: "end time",type:'time' },
          ]}
          selectDetailsManually={[
            {
              name: "status",
              nameShown: "Status",
              options: [
                { name: "available", nameShown: "available" },
                { name: "pending", nameShown: "pending" },
                { name: "processing", nameShown: "processing" },
                { name: "finished", nameShown: "finished" },
                { name: "canceled", nameShown: "canceled" },
              ],
            },
          ]}
          selectDetails={[
            {
              name: "appointment_type",
              nameShown: "appointment type",
              path: "appointments/types",
            },
            {
              name: "unit_service",
              nameShown: "unit service",
              path: "unitservice",
            },
            // {
            //   name: "department",
            //   nameShown: "Department",
            //   path: "departments",
            // },
            {
              name: "work_group",
              nameShown: "work group",
              path: "wgroups",
            },
            {
              name: "work_shift",
              nameShown: "work shift",
              path: "wshifts",
            },
            {
              name: "customer",
              nameShown: "customer",
              path: "customer",
            },
          ]}
          path={"appointments"}
          setIsAdding={setIsAdding}
          fetchData={fetchData}
        />
      )}
      {editting && (
        <EditModel
        textDetails={[
            { name: "name", nameShown: "name" },
            { name: "description", nameShown: "Description" },
            { name: "date", nameShown: "date",type:'date'},
            { name: "start_time", nameShown: "start time",type:'time'},
            { name: "end_time", nameShown: "end time",type:'time' },
          ]}
          selectDetailsManually={[
            {
              name: "status",
              nameShown: "Status",
              options: [
                { name: "available", nameShown: "available" },
                { name: "pending", nameShown: "pending" },
                { name: "processing", nameShown: "processing" },
                { name: "finished", nameShown: "finished" },
                { name: "canceled", nameShown: "canceled" },
              ],
            },
          ]}
          selectDetails={[
            {
              name: "unit_service",
              nameShown: "unit service",
              path: "unitservice",
            },
            // {
            //   name: "department",
            //   nameShown: "Department",
            //   path: "departments",
            // },
            {
              name: "work_group",
              nameShown: "work group",
              path: "wgroups",
            },
            {
              name: "work_shift",
              nameShown: "work shift",
              path: "wshifts",
            },
            {
              name: "appointment_type",
              nameShown: "appointment type",
              path: "appointments/types",
            },
            {
              name: "customer",
              nameShown: "customer",
              path: "customer",
            },
          ]}
          path={"appointments"}
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
            path={"appointments"}
            h2items={["name",'description','start_time','end_time']}
          />
        );
      })}
      
      <p>user</p>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
  model: state.model,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Appointments);
