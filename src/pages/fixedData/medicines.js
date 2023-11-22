import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { set } from '../../store/user.store';
import { setAddingCity } from '../../store/addingAndEditing.store';
import axiosHandler from '../../handlers/axiosHandler';
import AddMedicine from '../../components/fixedData/medicines/AddMedicine';
import EditMedicine from '../../components/fixedData/medicines/EditMedicine';
import MedicineCard from '../../components/fixedData/medicines/MedicineCard';

function Diseases(props) {
    const [data,setData] = useState()
    const [isAdding,setIsAdding] = useState(false)
    const [editting,setEditting] = useState('')
    const [error,setError] = useState()


    const fetchData = async()=>{
        await axiosHandler({setData:setData,setError:setError,method:'GET',path:'medicines/'}) 
    }
    useEffect(()=>{
        fetchData()
    },[])
    
  return (
    <div>data
        {isAdding && <AddMedicine setIsAdding ={setIsAdding} fetchData={fetchData}/>}
        {editting && <EditMedicine editting={editting} fetchData={fetchData}/>}
        <button onClick={()=>{setIsAdding(!isAdding)}}>Add</button>
        {data?.map((one,idx)=>{
            return(<MedicineCard key={idx} fetchData={fetchData} setEditting={setEditting} one={one}/>)
        })}
        {JSON.stringify(data)}
    </div>
  )
}

const mapStateToProps = (state) => ({
    user: state.user,
    model:state.model
});
const mapDispatchToProps = { set,setAddingCity };
export default connect(mapStateToProps, mapDispatchToProps)(Diseases);