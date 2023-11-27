import React, { useEffect, useState } from 'react'
import axiosHandler from '../../../handlers/axiosHandler';
import { connect } from "react-redux";

function AddDiet(props) {

    const [info,setInfo] = useState({name:'',description:'',duration:''})
    const [error,setError] = useState()
    function changeHandler (e){
        const {name,value} = e.target
        setInfo({...info,[name]:value})
    }
    async function submitHandler (e){
        e.preventDefault()
        await axiosHandler({setError,method:'POST',path:'diets/',data:info})
        setInfo({name:'',description:'',duration:''})
        props.fetchData()
    }
    
  return (
    <div>AddDiet
        <form onSubmit={submitHandler}>
            <label>Name</label>
            <input type='text' value={info.name} onChange={changeHandler} name='name'/>
            <label>Description</label>
            <input type='text' value={info.description} onChange={changeHandler} name='description'/>
            <label>Duration</label>
            <input type='number' value={info.duration} onChange={changeHandler} name='duration'/>
            <button type='submit'>Submit</button>
        </form>

    </div>
  )
}

const mapStateToProps = (state) => ({
    user: state.user.data,
    model:state.model
});
const mapDispatchToProps = { };
export default connect(mapStateToProps, mapDispatchToProps)(AddDiet);