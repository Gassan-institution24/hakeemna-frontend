import React, { useEffect, useState } from "react";
import axiosHandler from "./axiosHandler";
import { connect } from "react-redux";
import Cookies from "js-cookie";
import axios from "axios";

function EditModel({
  textDetails,
  selectDetails,
  multiSelectDetails,
  path,
  fetchData,
  editting
}) {
  const [info, setInfo] = useState();
  const [data, setData] = useState({});
  const [selected, setSelected] = useState({});
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
      method: "PATCH",
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
    selectDetails?.map((detail) => {
      getFromDB({
        topic: detail?.name,
        setError,
        method: "GET",
        path: detail?.path,
      });
    });
    multiSelectDetails?.map(async (detail) => {
      await getFromDB({
        topic: detail?.name,
        setError,
        method: "GET",
        path: detail?.path,
      });
    });
    axiosHandler({
      setData: setSelected,
      setError,
      method: "GET",
      path: `${path}/${editting}`,
    });
  }, []);
  useEffect(() => {
    setInfo(selected);
  }, [selected]);
  return (
    <div>
      EditModel
      <form id="myForm" onSubmit={submitHandler}>
        {textDetails?.map((detail) => {
          return (
            <>
              <label>{detail?.nameShown}</label>
              <input
                type={detail.type || "text"}
                // value={info[detail?.name] || ''}
                onChange={changeHandler}
                name={detail?.name}
              />
            </>
          );
        })}
        {selectDetails?.map((detail) => {
          return (
            <>
              <label>{detail?.nameShown}</label>
              <select onChange={changeHandler} name={detail?.name}>
                <option></option>
                {data[detail?.name]?.map((obj) => {
                  return (
                    <option selected={info[detail?.name]===obj.id} value={obj._id}>
                      {obj.name_english || obj.name}
                    </option>
                  );
                })}
              </select>
            </>
          );
        })}
        {multiSelectDetails?.map((detail) => {
          return (
            <>
              <label>{detail.nameShown}</label>
              {data[detail?.name]?.map((one) => {
                return (
                  <>
                    <label>{one.name || one.name_english}</label>
                    <input
                      type="checkbox"
                      id={one.name}
                      name={one.name}
                      checked={info[detail.name]?.includes(one._id)||info[detail.name]?.map((name)=>{if(name==detail.name){return true}})}
                      onChange={(e) => checkHandler(e, detail.name)}
                      value={one._id}
                    />
                  </>
                );
              })}
            </>
          );
        })}
        <button type="submit">Submit</button>
        {JSON.stringify(data)}
        <p>info</p>
        {JSON.stringify(info)}
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
