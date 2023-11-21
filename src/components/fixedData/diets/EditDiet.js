import React, { useEffect, useState } from 'react'
import axiosHandler from '../../../handlers/axiosHandler';
import { connect } from "react-redux";


function EditDiet(props) {

    const [selected,setSelected] = useState()
    const [info,setInfo] = useState({name:'',description:'',duration:''})
    const [error,setError] = useState()


    function changeHandler (e){
        const {name,value} = e.target
        setInfo({...info,[name]:value})
    }
    async function submitHandler (e){
        e.preventDefault()
        await axiosHandler({setError,method:'PATCH',path:`diets/${props.editting}`,data:info})
        setInfo({name:'',description:'',duration:''})
        props.fetchData()
    }

    useEffect(()=>{
        axiosHandler({setData:setSelected,setError,method:'GET',path:`diets/${props.editting}`})
    },[])
    useEffect(()=>{
        setInfo({name:selected?.name,description:selected?.description,duration:selected?.duration})
    },[selected])
    
  return (
    <div>EditDiet
        <form onSubmit={submitHandler}>
            <label>name</label>
            <input type='text' value={info.name} onChange={changeHandler} name='name'/>
            <label>description</label>
            <input type='text' value={info.description} onChange={changeHandler} name='description'/>
            <label>duration</label>
            <input type='number' value={info.duration} onChange={changeHandler} name='duration'/>
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
export default connect(mapStateToProps, mapDispatchToProps)(EditDiet);
