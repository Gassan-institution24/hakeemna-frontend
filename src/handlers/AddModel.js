import React, { useEffect, useState } from "react";
import axiosHandler from "./axiosHandler";
import { connect } from "react-redux";
import Cookies from "js-cookie";
import axios from "axios";

function AddModel({
  textDetails,
  selectDetails,
  selectDetailsRelated,
  selectDetailsRelayed,
  multiSelectDetails,
  path,
  fetchData,
  selectDetailsManually,
}) {
  const [info, setInfo] = useState();
  const [data, setData] = useState({});
  // const [checkedData,setCheckedData] =useState([])
  const [error, setError] = useState();

  function changeHandler(e) {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  }
  async function changeRelayedHandler(e) {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  
    const obj = { ...data };
    const promises = [];
  
    selectDetailsRelated?.forEach((detail) => {
      const promise = axiosHandler({
        setError,
        method: "GET",
        path: `${detail?.path}/${value}`,
      });
      promises.push(promise);
    });
  
    // Wait for all promises to resolve
    const resolvedDataArray = await Promise.all(promises);
  
    // Update the state after all promises have resolved
    resolvedDataArray.forEach((resolvedData, index) => {
      obj[selectDetailsRelated[index].name] = resolvedData.data;
    });
  
    setData(obj);
  }
  function checkHandler(e, category) {
    const { checked, value } = e.target;
    if (checked) {
      let selectedCategory = info[category] || [];
      setInfo({ ...info, [category]: [...selectedCategory, value] });
    } else {
      const data = info[category].filter((item) => item !== value);
      setInfo({ ...info, [category]: data });
    }
  }
  async function submitHandler(e) {
    e.preventDefault();
    //console.log('infooooooooooo',info)
    await axiosHandler({
      setError,
      method: "POST",
      path: path,
      data: info,
    });
    e.target.reset();
    fetchData();
  }
  const fetchRequiredData = async () => {
    const obj = {};
    const promises = [];

    // Fetch data for selectDetails
    selectDetails?.forEach((detail) => {
      const promise = axiosHandler({
        setError,
        method: "GET",
        path: detail?.path,
      });
      promises.push(promise.then((data) => (obj[detail.name] = data.data)));
    });

    selectDetailsRelayed?.forEach((detail) => {
      const promise = axiosHandler({
        setError,
        method: "GET",
        path: detail?.path,
      });
      promises.push(promise.then((data) => (obj[detail.name] = data.data)));
    });

    // Fetch data for multiSelectDetails
    multiSelectDetails?.forEach((detail) => {
      const promise = axiosHandler({
        setError,
        method: "GET",
        path: detail?.path,
      });
      promises.push(promise.data);
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    // Update the state after all promises have resolved
    setData(obj);
  };
  useEffect(() => {
    fetchRequiredData();
  }, []);
  //console.log("dataaaaaaa", data);
  return (
    <div className="addform">
      <form id="myForm" onSubmit={submitHandler}>
        {textDetails?.map((detail, i) => {
          return (
            <div key={i} className="insidaddform">
              <label>{detail?.nameShown}</label>
              <br/>
              <input className="input"
                type={detail.type || "text"}
                value={info?.detail?.name}
                onChange={changeHandler}
                name={detail?.name}
              />
            </div>
          );
        })}
        {selectDetailsManually?.map((detail, i) => {
          return (
            <div key={i} >
              <label>{detail?.nameShown}</label>
              <select onChange={changeHandler} name={detail?.name}>
                <option></option>
                {detail?.options?.map((option, i) => {
                  return (
                    <option key={i} value={option.name}>
                      {option.nameShown}
                    </option>
                  );
                })}
              </select>
            </div>
          );
        })}
        {selectDetails?.map((detail, i) => {
          return (
            <div key={i}>
              <label>{detail?.nameShown}</label>
              <select onChange={changeHandler} name={detail?.name}>
                <option></option>
                {data[detail?.name]?.map((obj, i) => {
                  return (
                    <option key={i} value={obj._id}>
                      {obj.name_english || obj.name}
                    </option>
                  );
                })}
              </select>
            </div>
          );
        })}
        {selectDetailsRelayed?.map((detail, i) => {
          return (
            <div key={i}>
              <label>{detail?.nameShown}</label>
              <select onChange={changeRelayedHandler} name={detail?.name}>
                <option></option>
                {data[detail?.name]?.map((obj, i) => {
                  return (
                    <option key={i} value={obj._id}>
                      {obj.name_english || obj.name}
                    </option>
                  );
                })}
              </select>
            </div>
          );
        })}
        {selectDetailsRelated?.map((detail, i) => {
          return (
            <div key={i}>
              <label>{detail?.nameShown}</label>
              <select onChange={changeHandler} name={detail?.name}>
                <option></option>
                {data[detail?.name]?.map((obj, i) => {
                  return (
                    <option key={i} value={obj._id}>
                      {obj.name_english || obj.name}
                    </option>
                  );
                })}
              </select>
            </div>
          );
        })}
        {multiSelectDetails?.map((detail, i) => {
          return (
            <div key={i}>
              <label>{detail.nameShown}</label>
              {data[detail?.name]?.map((one, i) => {
                return (
                  <div key={i}>
                    <label>{one.name || one.name_english}</label>
                    <input
                      type="checkbox"
                      id={one.name}
                      name={one.name}
                      onChange={(e) => checkHandler(e, detail.name)}
                      value={one._id}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
        <button type="reset">reset</button>
        <button type="submit">Submit</button>
        <p>data</p>
        {JSON.stringify(data)}
      </form>
      {JSON.stringify(info)}
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.data,
  model: state.model,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(AddModel);
