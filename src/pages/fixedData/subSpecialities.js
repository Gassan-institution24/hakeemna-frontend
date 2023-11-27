import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { set } from '../../store/user.store';
import { setAddingCity } from '../../store/addingAndEditing.store';
import axiosHandler from '../../handlers/axiosHandler';
import AddSubSpeciality from '../../components/fixedData/subSpecialities/AddSubSpeciality';
import EditSubSpeciality from '../../components/fixedData/subSpecialities/EditSubSpeciality';
import SubSpecialityCard from '../../components/fixedData/subSpecialities/SubSpecialityCard';

function SubSpecialities(props) {
    const [data,setData] = useState()
    const [isAdding,setIsAdding] = useState(false)
    const [editting,setEditting] = useState('')
    const [error,setError] = useState()


    const fetchData = async()=>{
        await axiosHandler({setData:setData,setError:setError,method:'GET',path:'subspecialities/'}) 
    }
    useEffect(()=>{
        fetchData()
    },[])
    
  return (
    <div>SubSpecialities
        {isAdding && <AddSubSpeciality setIsAdding ={setIsAdding} fetchData={fetchData}/>}
        {editting && <EditSubSpeciality editting={editting} fetchData={fetchData}/>}
        <button onClick={()=>{setIsAdding(!isAdding)}}>Add</button>
        {data?.map((one,idx)=>{
            return(<SubSpecialityCard key={idx} fetchData={fetchData} setEditting={setEditting} one={one}/>)
        })}
    </div>
  )
}

const mapStateToProps = (state) => ({
    user: state.user,
    model:state.model
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(SubSpecialities);