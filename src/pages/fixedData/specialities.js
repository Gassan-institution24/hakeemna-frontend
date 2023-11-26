import React, { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { setAddingCity } from '../../store/addingAndEditing.store';
import axiosHandler from '../../handlers/axiosHandler';
import AddSpeciality from '../../components/fixedData/speciatities/AddSpeciality';
import EditSpeciality from '../../components/fixedData/speciatities/EditSpeciality';
import SpecialityCard from '../../components/fixedData/speciatities/SpecialityCard';

function Specialities(props) {
    const [data,setData] = useState()
    const [isAdding,setIsAdding] = useState(false)
    const [editting,setEditting] = useState('')
    const [error,setError] = useState()


    const fetchData = async()=>{
        await axiosHandler({setData:setData,setError:setError,method:'GET',path:'specialities/'}) 
    }
    useEffect(()=>{
        fetchData()
    },[])
    
  return (
    <div>categories
        {isAdding && <AddSpeciality setIsAdding ={setIsAdding} fetchData={fetchData}/>}
        {editting && <EditSpeciality editting={editting} fetchData={fetchData}/>}
        <button onClick={()=>{setIsAdding(!isAdding)}}>Add</button>
        {data?.map((one,idx)=>{
            return(<SpecialityCard key={idx} fetchData={fetchData} setEditting={setEditting} one={one}/>)
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
export default connect(mapStateToProps, mapDispatchToProps)(Specialities);