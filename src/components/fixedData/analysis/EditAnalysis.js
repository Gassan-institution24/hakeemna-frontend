import React, { useEffect, useState } from 'react'
import axiosHandler from '../../../handlers/axiosHandler';
import { connect } from "react-redux";


function EditAnalysis(props) {

    const [analysis,setAnalysis] = useState()
    const [analysisInfo,setAnalysisInfo] = useState({name:'',description:''})
    const [error,setError] = useState()


    function changeHandler (e){
        const {name,value} = e.target
        setAnalysisInfo({...analysisInfo,[name]:value})
    }
    async function submitHandler (e){
        e.preventDefault()
        await axiosHandler({setError,method:'PATCH',path:`analysis/${props.editting}`,data:analysisInfo})
        setAnalysisInfo({name:'',description:''})
        props.fetchData()
    }

    useEffect(()=>{
        axiosHandler({setData:setAnalysis,setError,method:'GET',path:`analysis/${props.editting}`})
    },[])
    useEffect(()=>{
        setAnalysisInfo({name:analysis?.name,description:analysis?.description})
    },[analysis])
    
  return (
    <div>EditAnalysis
        <form onSubmit={submitHandler}>
            <label>name</label>
            <input type='text' value={analysisInfo.name} onChange={changeHandler} name='name'/>
            <label>description</label>
            <input type='text' value={analysisInfo.description} onChange={changeHandler} name='description'/>
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
export default connect(mapStateToProps, mapDispatchToProps)(EditAnalysis);
