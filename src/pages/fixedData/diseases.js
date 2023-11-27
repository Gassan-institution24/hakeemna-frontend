import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { setAddingCity } from '../../store/addingAndEditing.store';
import axiosHandler from '../../handlers/axiosHandler';
import AddDisease from '../../components/fixedData/diseases/AddDisease';
import DiseaseCard from '../../components/fixedData/diseases/DiseaseCard';
import EditDisease from '../../components/fixedData/diseases/EditDisease';

function Diseases(props) {
    const [diseases,setDiseases] = useState()
    const [isAdding,setIsAdding] = useState(false)
    const [editting,setEditting] = useState('')
    const [error,setError] = useState()


    const fetchData = async()=>{
        await axiosHandler({setData:setDiseases,setError:setError,method:'GET',path:'diseases/'}) 
    }
    useEffect(()=>{
        fetchData()
    },[])
    
  return (
    <div>diseases
        {isAdding && <AddDisease setIsAdding ={setIsAdding} fetchData={fetchData}/>}
        {editting && <EditDisease editting={editting} fetchData={fetchData}/>}
        <button onClick={()=>{setIsAdding(!isAdding)}}>Add</button>
        {diseases?.map((one,idx)=>{
            return(<DiseaseCard key={idx} fetchData={fetchData} setEditting={setEditting} one={one}/>)
        })}
    </div>
  )
}

const mapStateToProps = (state) => ({
    user: state.user,
    model:state.model
});
const mapDispatchToProps = { setAddingCity };
export default connect(mapStateToProps, mapDispatchToProps)(Diseases);