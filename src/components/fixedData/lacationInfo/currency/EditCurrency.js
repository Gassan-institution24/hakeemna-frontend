import React, { useEffect, useState } from 'react'
import axiosHandler from '../../../../handlers/axiosHandler';



function EditCurrency({setEditting,fetchData,editting}) {

    const [currency,setCurrency] = useState()
    const [currencyInfo,setCurrencyInfo] = useState({name_english:'',name_arabic:'',symbol:''})
    const [error,setError] = useState()
    function changeHandler (e){
        const {name,value} = e.target
        setCurrencyInfo({...currencyInfo,[name]:value})
    }
    async function submitHandler (e){
        e.preventDefault()
        await axiosHandler({setError,method:'PATCH',path:`currency/${editting}`,data:currencyInfo})
        setCurrencyInfo({name_english:'',name_arabic:'',symbol:''})
        fetchData()
    }

    useEffect(()=>{
        axiosHandler({setData:setCurrency,setError,method:'GET',path:`currency/${editting}`})
    },[])
    useEffect(()=>{
        setCurrencyInfo({name_english:currency?.name_english,name_arabic:currency?.name_arabic,symbol:currency?.symbol})
    },[currency])
    
  return (
    <div>EditCurrency
        <form onSubmit={submitHandler}>
            <label>name in English</label>
            <input type='text' value={currencyInfo.name_english} onChange={changeHandler} name='name_english'/>
            <label>الاسم باللغة العربية</label>
            <input type='text' value={currencyInfo.name_arabic} onChange={changeHandler} name='name_arabic'/>
            <label>Symbol</label>
            <input type='text' value={currencyInfo.symbol} onChange={changeHandler} name='symbol'/>
            <button type='submit'>Submit</button>
        </form>

    </div>
  )
}


export default EditCurrency
