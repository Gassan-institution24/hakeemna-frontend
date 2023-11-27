import React, { useEffect, useState } from "react";
import axiosHandler from "../../../handlers/axiosHandler";
import { connect } from "react-redux";

function AddMedicine(props) {
  const [countries, setCountries] = useState([]);
  const [families, setFamilies] = useState([]);
  const [sideEffects, setSideEffect] = useState([]);
  const [checkedData, setCheckedData] = useState([]);
  const [info, setInfo] = useState({
    trade_name: "",
    country: null,
    concentration: "",
    agent: "",
    price_1: "",
    price_2: "",
    ATCCODE: "",
    packaging: "",
    scientific_name: "",
    barcode: "",
    family: null,
    contraindication: "",
    sideEffects: [],
    status: "active",
  });
  const [error, setError] = useState();

  function changeHandler(e) {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  }
  function checkHandler(e) {
    const { checked, value } = e.target;
    if (checked) {
      setCheckedData([...checkedData, value]);
      setInfo({ ...info, sideEffects: [...checkedData, value] });
    } else {
      const data = checkedData.filter((item) => item !== value);
      setCheckedData(data);
      setInfo({ ...info, sideEffects: data });
    }
  }

  async function submitHandler(e) {
    e.preventDefault();
    await axiosHandler({
      setError,
      method: "POST",
      path: "medicines/",
      data: info,
    });
    setInfo({
      trade_name: "",
      country: null,
      concentration: "",
      agent: "",
      price_1: "",
      price_2: "",
      ATCCODE: "",
      packaging: "",
      scientific_name: "",
      barcode: "",
      family: null,
      contraindication: "",
      status: "active",
      sideEffects: [],
    });
    props.fetchData();
  }

  useEffect(() => {
    axiosHandler({
      setData: setCountries,
      setError,
      method: "GET",
      path: "countries/",
    });
    axiosHandler({
      setData: setFamilies,
      setError,
      method: "GET",
      path: "drugfamilies/",
    });
    axiosHandler({
      setData: setSideEffect,
      setError,
      method: "GET",
      path: "symptoms/",
    });
  }, []);
  return (
    <div>
      AddMedicine
      <form onSubmit={submitHandler}>
        <label>country</label>
        <select onChange={changeHandler} name="country">
          <option></option>
          {countries.map((country) => {
            return <option value={country._id}>{country.name_english}</option>;
          })}
        </select>

        <label>trade_name</label>
        <input
          type="text"
          value={info.trade_name}
          onChange={changeHandler}
          name="trade_name"
        />
        <label>concentration</label>
        <input
          type="text"
          value={info.concentration}
          onChange={changeHandler}
          name="concentration"
        />
        <label>agent</label>
        <input
          type="text"
          value={info.agent}
          onChange={changeHandler}
          name="agent"
        />
        <label>price_1</label>
        <input
          type="number"
          value={info.price_1}
          onChange={changeHandler}
          name="price_1"
        />
        <label>price_2</label>
        <input
          type="number"
          value={info.price_2}
          onChange={changeHandler}
          name="price_2"
        />
        <label>ATCCODE</label>
        <input
          type="text"
          value={info.ATCCODE}
          onChange={changeHandler}
          name="ATCCODE"
        />
        <label>packaging</label>
        <input
          type="text"
          value={info.packaging}
          onChange={changeHandler}
          name="packaging"
        />
        <label>scientific_name</label>
        <input
          type="text"
          value={info.scientific_name}
          onChange={changeHandler}
          name="scientific_name"
        />
        <label>barcode</label>
        <input
          type="text"
          value={info.barcode}
          onChange={changeHandler}
          name="barcode"
        />
        <label>Drug Family</label>
        <select value={info.family} onChange={changeHandler} name="family">
          <option></option>
          {families.map((family) => {
            return <option value={family._id}>{family.name}</option>;
          })}
        </select>
        <label>contraindication</label>
        <input
          type="text"
          value={info.contraindication}
          onChange={changeHandler}
          name="contraindication"
        />

        <label>sideEffects</label>
        {sideEffects?.map((sideEffect) => {
          <input
            type="checkbox"
            id={sideEffect.name}
            name={sideEffect.name}
            onChange={checkHandler}
            value={sideEffect._id}
          />;
        })}
        <label>status</label>
        <select value={info.status} onChange={changeHandler} name="status">
          <option value={"active"}>Active</option>
          <option value={"restrict"}>Restrict</option>
        </select>
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
export default connect(mapStateToProps, mapDispatchToProps)(AddMedicine);
