import React, { useEffect, useState } from 'react'
import axiosHandler from '../../../handlers/axiosHandler'
import { connect } from "react-redux";


function EditCity(props) {
    
    const [data,setData] = useState()
    const [info,setInfo] = useState({name_english:'',name_arabic:'',description:'',specialty:null})
    const [error,setError] = useState()
    function changeHandler (e){
        const {name,value} = e.target
        setInfo({...info,[name]:value})
    }
    async function submitHandler (e){
        e.preventDefault()
        await axiosHandler({setError,method:'PATCH',path:`subspecialities/${props.editing}`,data:info})
        setInfo({name_english:'',name_arabic:'',description:'',specialty:null})
        props.fetchData()
    }

    useEffect(()=>{
        axiosHandler({setData:setData,setError,method:'GET',path:`subspecialities/${props.editing}`})
    },[])
    useEffect(()=>{
        setInfo({name_english:data?.name_english,name_arabic:data?.name_arabic,description:data?.description,specialty:data?.specialty})
    },[data])
    
  return (
    <div>EditCity
        <form onSubmit={submitHandler}>
        <label>name in English</label>
            <input type='text' value={info.name_english} onChange={changeHandler} name='name_english'/>
            <label>الاسم باللغة العربية</label>
            <input type='text' value={info.name_arabic} onChange={changeHandler} name='name_arabic'/>
            <label>description</label>
            <input type='text' value={info.description} onChange={changeHandler} name='description'/>
            <label>speciality</label>
            <select onChange={changeHandler} name='speciality'>
                <option></option>
                {data.map((speciality)=>{
                    return(
                        <option selected={data.speciality === speciality._id} value={speciality._id}>{speciality.name_english}</option>
                    )
                })}
            </select>
            <button type='submit'>Submit</button>
        </form>
        
        

    </div>
  )
}


const mapStateToProps = (state) => ({
    user: state.user,
    model:state.model
});
const mapDispatchToProps = {  };
export default connect(mapStateToProps, mapDispatchToProps)(EditCity);
