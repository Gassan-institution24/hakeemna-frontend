import React, { useEffect, useState } from 'react'
import axiosHandler from '../../../../handlers/axiosHandler';

function AddCity(props) {

    const [countries,setCountries] = useState([])
    const [cityInfo,setCityInfo] = useState({name_english:'',name_arabic:'',country:''})
    const [response,setResponse] = useState([])
    const [error,setError] = useState()
    function changeHandler (e){
        const {name,value} = e.target
        setCityInfo({...cityInfo,[name]:value})
    }
    async function submitHandler (e){
        e.preventDefault()
        await axiosHandler({setData:setResponse,setError,method:'POST',path:'cities/',data:cityInfo})
        setCityInfo({name_english:'',country:'',name_arabic:''})
        props.fetchData()
    }

    useEffect(()=>{
        axiosHandler({setData:setCountries,setError,method:'GET',path:'countries/'})
    },[])
    
  return (
    <div>AddCity
        <form onSubmit={submitHandler}>
            <label>name in English</label>
            <input type='text' value={cityInfo.name_english} onChange={changeHandler} name='name_english'/>
            <label>الاسم باللغة العربية</label>
            <input type='text' value={cityInfo.name_arabic} onChange={changeHandler} name='name_arabic'/>
            <select value={cityInfo.country} onChange={changeHandler} name='country'>
                <option></option>
                {countries.map((country)=>{
                    return(
                        <option value={country._id}>{country.name_english}</option>
                    )
                })}
            </select>
            <button type='submit'>Submit</button>
        </form>

    </div>
  )
}

export default AddCity;