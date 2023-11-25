import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import axiosHandler from '../../handlers/axiosHandler';
import AddModel from '../../handlers/AddModel';
import EditModel from '../../handlers/EditModel';
import ModelCard from '../../handlers/ModelCard';

const Incomepayment = (props) => {
    const [data,setData] = useState([])
    const [isAdding,setIsAdding] = useState(false)
    const [editting,setEditting] = useState('')
    const [error,setError] = useState()
    const fetchData = async()=>{
        await axiosHandler({setData,setError,method:'GET',path:'incomepayment/'}) 
    }
    useEffect(()=>{
        fetchData()
    },[])
  return (
    <div>Valuetax
    {isAdding && <AddModel textDetails={[{name:'movements_year',nameShown:'movements_year', type: "number"},{name:'stakeholder_code',nameShown:'stakeholder_code', type: "number"}]}   path={'incomepayment'} selectDetails={[{name:"employee",nameShown:"employee", path:"employees"}]} setIsAdding ={setIsAdding} fetchData={fetchData}/>}
    {editting && (<EditModel textDetails={[{name: "movements_year",nameShown: "movements_year",type: "number",},{name:'stakeholder_code',nameShown:'stakeholder_code', type: "number"}]}path={`incomepayment`}selectDetails={[{name: "employee",nameShown: "employee", path: "employees", }]} editting={editting} fetchData={fetchData}/>)}

    <button onClick={()=>{setIsAdding(!isAdding)}}>Add</button>
    {data?.map((one,idx)=>{
        return(<ModelCard key={idx} fetchData={fetchData} setEditting={setEditting} one={one} path={'incomepayment'} h2items={['stakeholdercode','movementsyear','employee']}/>)
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
export default connect(mapStateToProps, mapDispatchToProps)(Incomepayment);




