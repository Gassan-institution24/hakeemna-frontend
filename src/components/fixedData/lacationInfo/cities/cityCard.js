import React from 'react'
import { setEditingCity } from '../../../../store/addingAndEditing.store';
import { connect } from "react-redux";
import axiosHandler from '../../../../handlers/axiosHandler';

function CityCard({city,setEditingCity,fetchData}) {
  async function deleteHandler (){
    await axiosHandler({method:'DELETE',path:`cities/${city._id}`})
    fetchData()
  }
  return (
    <div className='border'>
                <h3> {city.code}</h3>
                <h3>{city.name_english}</h3>
                <h3>{city.name_arabic} </h3>
                <p>{city?.country?.name_english} {city?.country?.code}</p>
                <button onClick={()=>{setEditingCity(city._id)}}>Edit</button>
                <button onClick={deleteHandler}>Delete</button>
            </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
  model:state.model
});
const mapDispatchToProps = { setEditingCity };
export default connect(mapStateToProps, mapDispatchToProps)(CityCard);