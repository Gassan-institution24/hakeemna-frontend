import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import axiosHandler from '../../handlers/axiosHandler';
import AddModel from '../../handlers/AddModel';
import EditModel from '../../handlers/EditModel';
import ModelCard from '../../handlers/ModelCard';

function Surgeries(props) {
    const [data,setData] = useState()
    const [isAdding,setIsAdding] = useState(false)
    const [editting,setEditting] = useState('')
    const [error,setError] = useState()


    const fetchData = async()=>{
        await axiosHandler({setData,setError,method:'GET',path:'surgeries/'}) 
    }
    useEffect(()=>{
        fetchData()
    },[])
    
  return (
    <div>Surgeries
        {isAdding && <AddModel textDetails={[{name:'name',nameShown:'name'},{name:'description',nameShown:'description'}]} multiSelectDetails={[{name:'diseases',path:'diseases'}]} path={'surgeries'} setIsAdding ={setIsAdding} fetchData={fetchData}/>}
        {editting && <EditModel textDetails={[{name:'name',nameShown:'name'},{name:'description',nameShown:'description'}]} multiSelectDetails={[{name:'diseases',path:'diseases'}]} path={'surgeries'} editting={editting} fetchData={fetchData}/>}
        <button onClick={()=>{setIsAdding(!isAdding)}}>Add</button>
        {data?.map((one,idx)=>{
            return(<ModelCard key={idx} fetchData={fetchData} setEditting={setEditting} one={one} path={'surgeries'} h2items={['name']} pitems={['description']}/>)
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
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Surgeries);