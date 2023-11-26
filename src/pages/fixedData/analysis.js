import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { setAddingCity } from '../../store/addingAndEditing.store';
import axiosHandler from '../../handlers/axiosHandler';
import AddAnalysis from '../../components/fixedData/analysis/AddAnalysis';
import AnalysisCard from '../../components/fixedData/analysis/AnalysisCard';
import EditAnalysis from '../../components/fixedData/analysis/EditAnalysis';

function Analysis(props) {
    const [analysis,setAnalysis] = useState()
    const [isAdding,setIsAdding] = useState(false)
    const [editting,setEditting] = useState('')
    const [error,setError] = useState()


    const fetchData = async()=>{
        await axiosHandler({setData:setAnalysis,setError:setError,method:'GET',path:'analysis/'}) 
    }
    console.log('analysis', analysis)
    useEffect(()=>{
        fetchData()
    },[])
    
  return (
    <div>analysis
        {isAdding && <AddAnalysis setIsAdding ={setIsAdding} fetchData={fetchData}/>}
        {editting && <EditAnalysis editting={editting} fetchData={fetchData}/>}
        <button onClick={()=>{setIsAdding(!isAdding)}}>Add</button>
        {analysis?.map((analysis,idx)=>{
            return(<AnalysisCard key={idx} fetchData={fetchData} setEditting={setEditting} analysis={analysis}/>)
        })}
        {JSON.stringify(props.user)}
        {JSON.stringify(props.model)}
    </div>
  )
}

const mapStateToProps = (state) => ({
    user: state.user,
    model:state.model
});
const mapDispatchToProps = { setAddingCity };
export default connect(mapStateToProps, mapDispatchToProps)(Analysis);