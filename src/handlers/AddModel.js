import React, { useEffect, useState } from "react";
import axiosHandler from "./axiosHandler";
import { connect } from "react-redux";

function AddModel({ textDetails: textDetails, selectDetails,multiSelectDetails, path: path }) {
  const [info, setInfo] = useState();
  const [data, setData] = useState();
  const [error, setError] = useState();
  function changeHandler(e) {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  }
  async function submitHandler(e) {
    e.preventDefault();
    await axiosHandler({
      setError,
      method: "POST",
      path: { path },
      data: info,
    });
    setInfo("");
    props.fetchData();
  }
  async function getFromDB ({path,method,data,topic}){
    try{
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
        if(response.status ===200){
          
            setData({...data,[topic]:response.data})
          
        }else{
          if(setError){
            setError(response.data)
          }
        }
    } catch(err){
        setError(err.message)
    }
  }
  useEffect(()=>{
    selectDetails.map((detail)=>{
        getFromDB({topic:detail.name,setError,method:'GET',path:detail.path})
    })
    multiSelectDetails.map((detail)=>{
        getFromDB({topic:detail.name,setError,method:'GET',path:detail.path})
    })
},[])
  return (
    <div>
      AddModel
      <form onSubmit={submitHandler}>
        {textDetails?.map((detail) => {
          return (
            <>
              <label>{detail.name}</label>
              <input
                type="text"
                value={info.detail.nameDB}
                onChange={changeHandler}
                name={detail.nameDB}
              />
            </>
          );
        })}
        {selectDetails?.map((detail) => {
          return (
            <>
              <label>{detail.name}</label>
              <select onChange={changeHandler} name={detail.nameDB}>
                <option></option>
                {data[detail.name].map((obj) => {
                  return (
                    <option value={obj._id}>
                      {obj.name_english||obj.name}
                    </option>
                  );
                })}
              </select>
            </>
          );
        })}
        {multiSelectDetails.map((detail)=>{
            {detail?.map((sideEffect) => {
                <input
                  type="checkbox"
                  id={sideEffect.name}
                  name={sideEffect.name}
                  onChange={checkHandler}
                  value={sideEffect._id}
                />;
              })}
        })}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.data,
  model: state.model,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(AddModel);
