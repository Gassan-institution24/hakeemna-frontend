import React, { useEffect, useState } from 'react'
import axiosHandler from '../../../handlers/axiosHandler';
import { connect } from "react-redux";

function AddAnalysis(props) {

    const [analysisInfo,setAnalysisInfo] = useState({name:'',description:''})
    const [error,setError] = useState()
    function changeHandler (e){
        const {name,value} = e.target
        setAnalysisInfo({...analysisInfo,[name]:value})
    }
    async function submitHandler (e){
        e.preventDefault()
        await axiosHandler({setError,method:'POST',path:'analysis/',data:analysisInfo})
        setAnalysisInfo({name:'',description:''})
        props.fetchData()
    }
    
  return (
    <div>AddAnalysis
        <form onSubmit={submitHandler}>
            <label>Name</label>
            <input type='text' value={analysisInfo.name} onChange={changeHandler} name='name'/>
            <label>Description</label>
            <input type='text' value={analysisInfo.description} onChange={changeHandler} name='description'/>
            <button type='submit'>Submit</button>
        </form>
        {JSON.stringify(error)}
        {JSON.stringify(props.user)}

    </div>
  )
}

const mapStateToProps = (state) => ({
    user: state.user.data,
    model:state.model
});
const mapDispatchToProps = { };
export default connect(mapStateToProps, mapDispatchToProps)(AddAnalysis);