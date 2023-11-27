import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import axiosHandler from '../../handlers/axiosHandler';
import AddModel from '../../handlers/AddModel';
import EditModel from '../../handlers/EditModel';
import ModelCard from '../../handlers/ModelCard';

function Added_value_tax_GD(props) {
    const [data,setData] = useState()
    const [isAdding,setIsAdding] = useState(false)
    const [editting,setEditting] = useState('')
    const [error,setError] = useState()


    const fetchData = async()=>{
        await axiosHandler({setData,setError,method:'GET',path:'addedvaluetaxgd/'}) 
    }
    useEffect(()=>{
        fetchData()
    },[])
    
  return (
    <div>Surgeries
        {isAdding && <AddModel textDetails={[{name:'TAX_code',nameShown:'TAX_code'}]}   path={'addedvaluetaxgd'} selectDetails={[{name:"unit_service",nameShown:"unit service", path:"unitservice"}]} setIsAdding ={setIsAdding} fetchData={fetchData}/>}
        {editting && <EditModel textDetails={[{name:'TAX_code',nameShown:'TAX_code'}]}  path={`addedvaluetaxgd`} selectDetails={[{name:"unit_service",nameShown:"unit service", path:"unitservice"}]} editting={editting} fetchData={fetchData}/>}
        <button onClick={()=>{setIsAdding(!isAdding)}}>Add</button>
        {data?.map((one,idx)=>{
            return(<ModelCard key={idx} fetchData={fetchData} setEditting={setEditting} one={one} path={'addedvaluetaxgd'} h2items={['TAX_code','unit_service']}/>)
        })}
        
        
    </div>
  )
}

const mapStateToProps = (state) => ({
    user: state.user,
    model:state.model
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Added_value_tax_GD);