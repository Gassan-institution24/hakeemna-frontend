import React, { useEffect, useState } from "react";
import axiosHandler from "./axiosHandler";
import { connect } from "react-redux";
import Cookies from "js-cookie";
import axios from "axios";

function AddModel({
  textDetails,
  selectDetails,
  multiSelectDetails,
  path,
  fetchData,
  selectDetailsManually
}) {
  const [info, setInfo] = useState();
  const [data, setData] = useState({});
  // const [checkedData,setCheckedData] =useState([])
  const [error, setError] = useState();

  function changeHandler(e) {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
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
  function clearForm() {
    // Get the form element
    var form = document.getElementById("myForm");

    // Iterate through all form elements
    for (var i = 0; i < form.elements.length; i++) {
      var element = form.elements[i];

      // Check if the element is an input field
      if (
        element.type !== "button" &&
        element.type !== "submit" &&
        element.type !== "reset"
      ) {
        // Set the value to an empty string
        element.value = "";
      }
    }
  }
  async function submitHandler(e) {
    e.preventDefault();
    await axiosHandler({
      setError,
      method: "POST",
      path: path,
      data: info,
    });
    clearForm();
    fetchData();
  }
  async function getFromDB({ path, method, data, topic }) {
    try {
      const url = "http://localhost:3000/api/" + path;
      const token = Cookies.get("user_token");
      const response = await axios({
        method: method,
        url: url,
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: data,
      });
      if (response.status === 200) {
        setData({ ...data, [topic]: response.data });
      } else {
        if (setError) {
          setError(response.data);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  }
  useEffect(() => {
    selectDetails?.map(async(detail,i) => {
      await getFromDB({
        topic: detail?.name,
        setError,
        method: "GET",
        path: detail?.path,
      });
    });
    multiSelectDetails?.map(async (detail,i) => {
      await getFromDB({
        topic: detail?.name,
        setError,
        method: "GET",
        path: detail?.path,
      });
    });
  }, []);
  return (
    <div>
      <form id="myForm" onSubmit={submitHandler}>
        {textDetails?.map((detail,i) => {
          return (
            <div key={i}>
              <label>{detail?.nameShown}</label>
              <input
                type={detail.type || "text"}
                value={info?.detail?.name}
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
              <select onChange={changeHandler} name={detail?.name}>
                <option></option>
                {detail?.options?.map((option,i) => {
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
        {selectDetails?.map((detail,i) => {
          return (
            <div key={i}>
              <label>{detail?.nameShown}</label>
              <select onChange={changeHandler} name={detail?.name}>
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
        {/* {JSON.stringify(data)} */}
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
