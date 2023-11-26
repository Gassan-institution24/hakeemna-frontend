import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { setAddingCity } from '../../store/addingAndEditing.store';
import axiosHandler from '../../handlers/axiosHandler';
import AddFamily from '../../components/fixedData/medicinesFamilies/AddFamily';
import EditFamily from '../../components/fixedData/medicinesFamilies/EditFamily';
import FamilyCard from '../../components/fixedData/medicinesFamilies/FamilyCard';


function MedicalCategories(props) {
    const [data,setData] = useState()
    const [isAdding,setIsAdding] = useState(false)
    const [editting,setEditting] = useState('')
    const [error,setError] = useState()


    const fetchData = async()=>{
        await axiosHandler({setData:setData,setError:setError,method:'GET',path:'drugfamilies/'}) 
    }
    useEffect(()=>{
        fetchData()
    },[])
    
  return (
    <div>categories
        {isAdding && <AddFamily setIsAdding ={setIsAdding} fetchData={fetchData}/>}
        {editting && <EditFamily editting={editting} fetchData={fetchData}/>}
        <button onClick={()=>{setIsAdding(!isAdding)}}>Add</button>
        {data?.map((one,idx)=>{
            return(<FamilyCard key={idx} fetchData={fetchData} setEditting={setEditting} one={one}/>)
        })}
        {JSON.stringify(data)}
        {JSON.stringify(props.model)}
    </div>
  )
}

const mapStateToProps = (state) => ({
    user: state.user,
    model:state.model
});
const mapDispatchToProps = { setAddingCity };
export default connect(mapStateToProps, mapDispatchToProps)(MedicalCategories);