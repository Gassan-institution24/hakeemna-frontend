import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { set } from '../../store/user.store';
import { setAddingCity } from '../../store/addingAndEditing.store';
import axiosHandler from '../../handlers/axiosHandler';
import AddDiet from '../../components/fixedData/diets/AddDiet';
import DietCard from '../../components/fixedData/diets/DietCard';
import EditDiet from '../../components/fixedData/diets/EditDiet';

function Diets(props) {
    const [diets,setDiets] = useState()
    const [isAdding,setIsAdding] = useState(false)
    const [editting,setEditting] = useState('')
    const [error,setError] = useState()


    const fetchData = async()=>{
        await axiosHandler({setData:setDiets,setError:setError,method:'GET',path:'diets/'}) 
    }
    useEffect(()=>{
        fetchData()
    },[])
    
  return (
    <div>diets
        {isAdding && <AddDiet setIsAdding ={setIsAdding} fetchData={fetchData}/>}
        {editting && <EditDiet editting={editting} fetchData={fetchData}/>}
        <button onClick={()=>{setIsAdding(!isAdding)}}>Add</button>
        {diets?.map((one,idx)=>{
            return(<DietCard key={idx} fetchData={fetchData} setEditting={setEditting} one={one}/>)
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
const mapDispatchToProps = { set,setAddingCity };
export default connect(mapStateToProps, mapDispatchToProps)(Diets);