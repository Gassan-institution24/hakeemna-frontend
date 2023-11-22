import React, { useEffect, useState } from 'react'
import axiosHandler from '../../../handlers/axiosHandler';
import { connect } from "react-redux";

function AddSpeciality(props) {

    const [info,setInfo] = useState({name_english:'',name_arabic:'',description:''})
    const [error,setError] = useState()
    function changeHandler (e){
        const {name,value} = e.target
        setInfo({...info,[name]:value})
    }
    async function submitHandler (e){
        e.preventDefault()
        await axiosHandler({setError,method:'POST',path:'specialities/',data:info})
        setInfo({name_english:'',name_arabic:'',description:''})
        props.fetchData()
    }
    
  return (
    <div>AddSpeciality
        <form onSubmit={submitHandler}>
            <label>name english</label>
            <input type='text' value={info.name_english} onChange={changeHandler} name='name_english'/>
            <label>name arabic</label>
            <input type='text' value={info.name_arabic} onChange={changeHandler} name='name_arabic'/>
            <label>description</label>
            <input type='text' value={info.description} onChange={changeHandler} name='description'/>
            <button type='submit'>Submit</button>
        </form>
        {JSON.stringify(error)}

    </div>
  )
}

const mapStateToProps = (state) => ({
    user: state.user.data,
    model:state.model
});
const mapDispatchToProps = { };
export default connect(mapStateToProps, mapDispatchToProps)(AddSpeciality);