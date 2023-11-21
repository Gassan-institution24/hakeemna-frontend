import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { set } from '../../../store/user.store';
import { setAddingCity } from '../../../store/addingAndEditing.store';
import axiosHandler from '../../../handlers/axiosHandler';
import CityCard from '../../../components/fixedData/lacationInfo/cities/cityCard';
import AddCity from '../../../components/fixedData/lacationInfo/cities/AddCity';
import EditCity from '../../../components/fixedData/lacationInfo/cities/EditCity';


function Cities(props) {
    const [cities,setCities] = useState()
    const [error,setError] = useState()


    const fetchData = async()=>{
        await axiosHandler({setData:setCities,setError:setError,method:'GET',path:'cities/'}) 
    }
    console.log('cities', cities)
    useEffect(()=>{
        fetchData()
    },[])
    
  return (
    <div>Cities
        {props.model.addingCity && <AddCity setAddingCity ={props.setAddingCity} fetchData={fetchData}/>}
        {props.model.editingCity && <EditCity fetchData={fetchData}/>}
        <button onClick={()=>{props.setAddingCity(!props.model.addingCity)}}>Add</button>
        {cities?.map((city,idx)=>{
            return(<CityCard key={idx} fetchData={fetchData} city={city}/>)
        })}

    </div>
  )
}

const mapStateToProps = (state) => ({
    user: state.user,
    model:state.model
});
const mapDispatchToProps = { set,setAddingCity };
export default connect(mapStateToProps, mapDispatchToProps)(Cities);