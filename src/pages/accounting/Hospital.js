import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import axiosHandler from '../../handlers/axiosHandler';
import AddModel from '../../handlers/AddModel';
import EditModel from '../../handlers/EditModel';
import ModelCard from '../../handlers/ModelCard';
const Hospital = (props) => {
    const [data,setData] = useState()
    const [isAdding,setIsAdding] = useState(false)
    const [editting,setEditting] = useState('')
    const [error,setError] = useState()
    const fetchData = async()=>{
        await axiosHandler({setData,setError,method:'GET',path:'hospital/'}) 
    }
    useEffect(()=>{
        fetchData()
    },[])
  return (
    <div>Valuetax
    {isAdding && <AddModel textDetails={[{name:'Hospital_department_name_English',nameShown:'English department name', type: "string"},{name:'Hospital_department_name_Arabic',nameShown:'Arabic department name', type: "string"}]}   path={'hospital'} selectDetails={[{name:"City",nameShown:"City", path:"cities"}]} setIsAdding ={setIsAdding} fetchData={fetchData}/>}
    {editting && (<EditModel textDetails={[{name: "Hospital_department_name_English",nameShown: "Hospital department name",type: "string",},]}path={`hospital`}selectDetails={[{name: "City",nameShown: "City", path: "cities", },{name:'Hospital_department_name_Arabic',nameShown:'Hospital department name', type: "string"}]} editting={editting} fetchData={fetchData}/>)}

    <button onClick={()=>{setIsAdding(!isAdding)}}>Add</button>
    {data?.map((one,idx)=>{
        return(<ModelCard key={idx} fetchData={fetchData} setEditting={setEditting} one={one} path={'hospital'} h2items={['Hospital_department_name_English','Hospital_department_name_Arabic','City']}/>)
    })}
    
    
</div>
  )

};

const mapStateToProps = (state) => ({
    user: state.user,
    model:state.model
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Hospital);


