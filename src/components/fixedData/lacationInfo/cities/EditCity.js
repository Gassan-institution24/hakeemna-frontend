import React, { useEffect, useState } from 'react'
import axiosHandler from '../../../../handlers/axiosHandler';
import { connect } from "react-redux";


function EditCity(props) {

    const [city,setCity] = useState()
    const [cityInfo,setCityInfo] = useState({name_english:'',name_arabic:''})
    const [error,setError] = useState()
    function changeHandler (e){
        const {name,value} = e.target
        setCityInfo({...cityInfo,[name]:value})
    }
    async function submitHandler (e){
        e.preventDefault()
        await axiosHandler({setError,method:'PATCH',path:`cities/${props.model.editingCity}`,data:cityInfo})
        setCityInfo({name_english:'',name_arabic:''})
        props.fetchData()
    }

    useEffect(()=>{
        axiosHandler({setData:setCity,setError,method:'GET',path:`cities/${props.model.editingCity}`})
    },[])
    useEffect(()=>{
        setCityInfo({name_english:city?.name_english,name_arabic:city?.name_arabic})
    },[city])
    
  return (
    <div>EditCity
        <form onSubmit={submitHandler}>
            <label>name in English</label>
            <input type='text' value={cityInfo.name_english} onChange={changeHandler} name='name_english'/>
            <label>الاسم باللغة العربية</label>
            <input type='text' value={cityInfo.name_arabic} onChange={changeHandler} name='name_arabic'/>
            <button type='submit'>Submit</button>
        </form>
        {JSON.stringify(error)}
        {JSON.stringify(props.user)}

    </div>
  )
}


const mapStateToProps = (state) => ({
    user: state.user,
    model:state.model
});
const mapDispatchToProps = {  };
export default connect(mapStateToProps, mapDispatchToProps)(EditCity);
