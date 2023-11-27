import React, { useEffect, useState } from 'react'
import axiosHandler from '../../../handlers/axiosHandler';
import { connect } from "react-redux";

function AddFamily(props) {

    const [info,setInfo] = useState({name:'',description:''})
    const [error,setError] = useState()
    function changeHandler (e){
        const {name,value} = e.target
        setInfo({...info,[name]:value})
    }
    async function submitHandler (e){
        e.preventDefault()
        await axiosHandler({setError,method:'POST',path:'drugfamilies/',data:info})
        setInfo({name:'',description:''})
        props.fetchData()
    }
    
  return (
    <div>AddFamily
        <form onSubmit={submitHandler}>
            <label>Name</label>
            <input type='text' value={info.name} onChange={changeHandler} name='name'/>
            <label>description</label>
            <input type='text' value={info.description} onChange={changeHandler} name='description'/>
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
export default connect(mapStateToProps, mapDispatchToProps)(AddFamily);