import React, { useEffect, useState } from 'react'
import axiosHandler from '../../../handlers/axiosHandler';
import { connect } from "react-redux";

function AddDisease(props) {
    const [categories,setCategories]=useState([])
    const [symptoms,setSymptoms]=useState([])
    const [checkedData,setCheckedData]=useState([])
    const [info,setInfo] = useState({name:'',category:null,symptoms:[]})
    const [error,setError] = useState()


    function changeHandler (e){
        const {name,value} = e.target
        setInfo({...info,[name]:value})
    }
    function checkHandler (e){
        const{checked, value}=e.target
        if(checked){
            setCheckedData([...checkedData,value])
            setInfo({...info,symptoms:[...checkedData,value]})
        }else{
            const data = checkedData.filter(item=>item!==value)
            setCheckedData(data)
            setInfo({...info,symptoms:data})
        }
    }
    
    async function submitHandler (e){
        e.preventDefault()
        await axiosHandler({setError,method:'POST',path:'diseases/',data:info})
        setInfo({name:'',category:null,symptoms:[]})
        props.fetchData()
    }

    useEffect(()=>{
        axiosHandler({setData:setCategories,setError,method:'GET',path:'medcategories/'})
        axiosHandler({setData:setSymptoms,setError,method:'GET',path:'symptoms/'})
    },[])
  return (
    <div>AddDisease
        <form onSubmit={submitHandler}>
            <label>Name</label>
            <input type='text' value={info.name} onChange={changeHandler} name='name'/>
            <select value={info.category} onChange={changeHandler} name='category'>
                <option></option>
                {categories.map((category)=>{
                    return(
                        <option value={category._id}>{category.name}</option>
                    )
                })}
            </select>
            
            <label>symptoms</label>
            {symptoms?.map((symptom)=>{
                <input type="checkbox" id={symptom.name} name={symptom.name} onChange={checkHandler} value={symptom._id}/>
            })}
            <button type='submit'>Submit</button>
        </form>
        {JSON.stringify(error)}

    </div>
  )
}

const mapStateToProps = (state) => ({
    user: state.user.data,
    model:state.model
});
const mapDispatchToProps = { };
export default connect(mapStateToProps, mapDispatchToProps)(AddDisease);