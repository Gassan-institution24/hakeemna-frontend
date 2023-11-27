import React, { useEffect, useState } from "react";
import axiosHandler from "../axiosHandler";
import { connect } from "react-redux";
import Cookies from "js-cookie";
import axios from "axios";

function EditModel({
  textDetails,
  selectDetails,
  selectDetailsRelated,
  selectDetailsRelayed,
  multiSelectDetails,
  path,
  fetchData,
  editting,
  selectDetailsManually
}) {
  const [info, setInfo] = useState({});
  const [data, setData] = useState({});
  const [selected, setSelected] = useState({});
  const [error, setError] = useState();

  function changeHandler(e) {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  }
  function checkHandler(e, category) {
    const { checked, value } = e.target;
    if (checked) {
        //console.log('checked')
      let selectedCategory = info[category] || [];
      setInfo({ ...info, [category]: [...selectedCategory, value] });
    } else {
        //console.log("not checked")
      const data = info[category].filter((item) => item !== value&&item._id !== value);
      setInfo({ ...info, [category]: data });
    }
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
  async function submitHandler(e) {
    e.preventDefault();
    await axiosHandler({
      setError,
      method: "PATCH",
      path: `${path}/${editting}`,
      data: info,
    });
    setInfo({})
    e.target.reset()
    fetchData();
  }

  useEffect(() => {
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

      await axiosHandler({
        setData:setSelected,
        setError,
        method: "GET",
        path: `${path}/${editting}`,
      });
    };
      // Fetch additional data using axiosHandler
  
    fetchRequiredData();
  }, []); // Add editting to the dependency array to re-run the effect when it changes
  
  useEffect(() => {
    setInfo(selected);
    //console.log(selected)
    //console.log('infooooo',info)
  }, [selected]);
  return (
    <div>
      EditModel
      <form id="myForm" onSubmit={submitHandler}>
        {textDetails?.map((detail,i) => {
          return (
            <div key={i}>
              <label>{detail?.nameShown}</label>
              <input
                type={detail.type || "text"}
                value={info[detail?.name] || ''}
                onChange={changeHandler}
                name={detail?.name}
              />
            </div>
          );
        })}
        {selectDetailsManually?.map((detail,i) => {
          return (
            <div key={i}>
              <label>{detail?.nameShown}</label>
              <select value={info[detail.name]} onChange={changeHandler} name={detail?.name}>
                <option></option>
                {detail?.options?.map((obj,i) => {
                  return (
                    <option key={i} value={obj.name}>
                      {obj.nameShown}
                    </option>
                  );
                })}
              </select>
            </div>
          );
        })}
        {selectDetails?.map((detail,i) => {
          return (
            <div key={i}>
              <label>{detail?.nameShown}</label>
              <select value={info[detail.name||detail.name_english]?._id||info[detail.name]} onChange={changeHandler} name={detail?.name}>
                <option></option>
                {data[detail?.name]?.map((obj,i) => {
                  return (
                    <option key={i}  value={obj._id}>
                      {obj.name_english || obj.name}
                    </option>
                  );
                })}
              </select>
            </div>
          );
        })}
        {selectDetailsRelayed?.map((detail,i) => {
          return (
            <div key={i}>
              <label>{detail?.nameShown}</label>
              <select value={info[detail.name||detail.name_english]?._id||info[detail.name]} onChange={changeRelayedHandler} name={detail?.name}>
                <option></option>
                {data[detail?.name]?.map((obj,i) => {
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
        {selectDetailsRelated?.map((detail,i) => {
          return (
            <div key={i}>
              <label>{detail?.nameShown}</label>
              <select value={info[detail.name||detail.name_english]?._id||info[detail.name]} onChange={changeHandler} name={detail?.name}>
                <option></option>
                {data[detail?.name]?.map((obj,i) => {
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
        {multiSelectDetails?.map((detail,i) => {
          return (
            <div key={i}>
              <label>{detail.nameShown}</label>
              {data[detail?.name]?.map((one,i) => {
                return (
                  <div key={i}>
                    <label>{one.name || one.name_english}</label>
                    <input
                      type="checkbox"
                      id={one.name}
                      name={one.name}
                      checked={info[detail.name]?.includes(one._id) || info[detail.name]?.some((model) => model._id === one._id)}
                      onChange={(e) => checkHandler(e, detail.name)}
                      value={one._id}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
        <button type="submit">Submit</button>
        
        <p>info</p>
      </form>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.data,
  model: state.model,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(EditModel);
