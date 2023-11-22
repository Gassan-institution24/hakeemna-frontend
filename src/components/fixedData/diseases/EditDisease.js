import React, { useEffect, useState } from 'react'
import axiosHandler from '../../../handlers/axiosHandler';
import { connect } from "react-redux";


function EditDisease(props) {
    const [categories,setCategories]=useState([])
    const [symptoms,setSymptoms]=useState([])
    const [checkedData,setCheckedData]=useState([])
    const [selected,setSelected] = useState()
    const [info,setInfo] = useState({name:'',category:'',symptoms:[]})
    const [error,setError] = useState()


    function changeHandler (e){
        const {name,value} = e.target
        setInfo({...info,[name]:value})
    }

    function checkHandler (e){
        const{checked, value}=e.target
        if(checked){
            setCheckedData([...checkedData,value])
        }else{
            const data = checkedData.filter(item=>item!==value)
            setCheckedData(data)
        }
    }

    async function submitHandler (e){
        e.preventDefault()
        await axiosHandler({setError,method:'PATCH',path:`diseases/${props.editting}`,data:info})
        setInfo({name:'',category:'',symptoms:[]})
        props.fetchData()
    }

    useEffect(()=>{
        axiosHandler({setData:setCategories,setError,method:'GET',path:'medcategories/'})
        axiosHandler({setData:setSymptoms,setError,method:'GET',path:'symptoms/'})
        axiosHandler({setData:setSelected,setError,method:'GET',path:`diseases/${props.editting}`})
    },[])
    useEffect(()=>{
        setInfo({name:selected?.name,category:selected?.category,symptoms:selected?.symptoms})
        setCheckedData(selected?.symptoms)
    },[selected])
    
  return (
    <div>EditDisease
        <form onSubmit={submitHandler}>
            <label>Name</label>
            <input type='text' value={info.name} onChange={changeHandler} name='name'/>
            <select value={info.category} onChange={changeHandler} name='category'>
                <option></option>
                {categories.map((category)=>{
                    return(
                        <option selected={info.category == category._id} value={category._id}>{category.name}</option>
                    )
                })}
            </select>
            
            <label>symptoms</label>
            {symptoms?.map((symptom)=>{
                <input type="checkbox" id={symptom.name} name={symptom.name} onChange={checkHandler} checked={checkedData.includes(symptom._id)} value={symptom._id}/>
            })}
            <button type='submit'>Submit</button>
        </form>
        {JSON.stringify(error)}
        {JSON.stringify(props.user)}

    </div>
  )
}


const mapStateToProps = (state) => ({
    user: state.user,
    model:state.model
});
const mapDispatchToProps = {  };
export default connect(mapStateToProps, mapDispatchToProps)(EditDisease);
