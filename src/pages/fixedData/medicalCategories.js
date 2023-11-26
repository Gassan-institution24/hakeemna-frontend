import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { setAddingCity } from '../../store/addingAndEditing.store';
import axiosHandler from '../../handlers/axiosHandler';
import AddCategory from '../../components/fixedData/medicalCategries/AddCategory';
import CategoryCard from '../../components/fixedData/medicalCategries/CategoryCard';
import EditCategory from '../../components/fixedData/medicalCategries/EditCategory';


function MedicalCategories(props) {
    const [data,setData] = useState()
    const [isAdding,setIsAdding] = useState(false)
    const [editting,setEditting] = useState('')
    const [error,setError] = useState()


    const fetchData = async()=>{
        await axiosHandler({setData:setData,setError:setError,method:'GET',path:'medcategories/'}) 
    }
    useEffect(()=>{
        fetchData()
    },[])
    
  return (
    <div>categories
        {isAdding && <AddCategory setIsAdding ={setIsAdding} fetchData={fetchData}/>}
        {editting && <EditCategory editting={editting} fetchData={fetchData}/>}
        <button onClick={()=>{setIsAdding(!isAdding)}}>Add</button>
        {data?.map((one,idx)=>{
            return(<CategoryCard key={idx} fetchData={fetchData} setEditting={setEditting} one={one}/>)
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