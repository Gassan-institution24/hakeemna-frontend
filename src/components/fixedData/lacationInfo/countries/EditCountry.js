import React, { useEffect, useState } from 'react'
import axiosHandler from '../../../../handlers/axiosHandler';



function EditCountry({setEditting,fetchData,editting}) {

    const [country,setCountry] = useState()
    const [countryInfo,setCountryInfo] = useState({name_english:'',name_arabic:''})
    const [error,setError] = useState()
    function changeHandler (e){
        const {name,value} = e.target
        setCountryInfo({...countryInfo,[name]:value})
    }
    async function submitHandler (e){
        e.preventDefault()
        await axiosHandler({setError,method:'PATCH',path:`countries/${editting}`,data:countryInfo})
        setCountryInfo({name_english:'',name_arabic:''})
        fetchData()
    }

    useEffect(()=>{
        axiosHandler({setData:setCountry,setError,method:'GET',path:`countries/${editting}`})
    },[])
    useEffect(()=>{
        setCountryInfo({name_english:country?.name_english,name_arabic:country?.name_arabic})
    },[country])
    
  return (
    <div>EditCountry
        <form onSubmit={submitHandler}>
            <label>name in English</label>
            <input type='text' value={countryInfo.name_english} onChange={changeHandler} name='name_english'/>
            <label>الاسم باللغة العربية</label>
            <input type='text' value={countryInfo.name_arabic} onChange={changeHandler} name='name_arabic'/>
            <button type='submit'>Submit</button>
        </form>

    </div>
  )
}


export default EditCountry
