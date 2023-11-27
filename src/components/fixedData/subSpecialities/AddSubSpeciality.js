import React, { useEffect, useState } from 'react'
import axiosHandler from '../../../handlers/axiosHandler'

function AddSubSpeciality(props) {

    const [specialites,setSpecialities] = useState([])
    const [info,setInfo] = useState({name_english:'',name_arabic:'',description:'',specialty:null})
    const [response,setResponse] = useState([])
    const [error,setError] = useState()
    function changeHandler (e){
        const {name,value} = e.target
        setInfo({...info,[name]:value})
    }
    async function submitHandler (e){
        e.preventDefault()
        await axiosHandler({setData:setResponse,setError,method:'POST',path:'subspecialities/',data:info})
        setInfo({name_english:'',name_arabic:'',description:'',specialty:null})
        props.fetchData()
    }

    useEffect(()=>{
        axiosHandler({setData:setSpecialities,setError,method:'GET',path:'specialities/'})
    },[])
    
  return (
    <div>AddSubSpeciality
        <form onSubmit={submitHandler}>
            <label>name in English</label>
            <input type='text' value={info.name_english} onChange={changeHandler} name='name_english'/>
            <label>الاسم باللغة العربية</label>
            <input type='text' value={info.name_arabic} onChange={changeHandler} name='name_arabic'/>
            <label>description</label>
            <input type='text' value={info.description} onChange={changeHandler} name='description'/>
            <label>speciality</label>
            <select onChange={changeHandler} name='speciality'>
                <option></option>
                {specialites.map((speciality)=>{
                    return(
                        <option value={speciality._id}>{speciality.name_english}</option>
                    )
                })}
            </select>
            <button type='submit'>Submit</button>
        </form>

    </div>
  )
}

export default AddSubSpeciality;