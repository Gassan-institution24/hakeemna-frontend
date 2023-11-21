import React, { useEffect, useState } from 'react'
import axiosHandler from '../../../../handlers/axiosHandler';

function AddCountry({fetchData}) {

    const [countryInfo,setCountryInfo] = useState({name_english:'',name_arabic:''})
    const [error,setError] = useState()
    function changeHandler (e){
        const {name,value} = e.target
        setCountryInfo({...countryInfo,[name]:value})
    }
    async function submitHandler (e){
        e.preventDefault()
        await axiosHandler({setError,method:'POST',path:'countries/',data:countryInfo})
        setCountryInfo({name_english:'',country:'',name_arabic:''})
        fetchData()
    }

    
  return (
    <div>AddCountry
        <form onSubmit={submitHandler}>
            <label>name in English</label>
            <input type='text' value={countryInfo.name_english} onChange={changeHandler} name='name_english'/>
            <label>الاسم باللغة العربية</label>
            <input type='text' value={countryInfo.name_arabic} onChange={changeHandler} name='name_arabic'/>
            <button type='submit'>Submit</button>
        </form>
        {JSON.stringify(error)}

    </div>
  )
}

export default AddCountry;