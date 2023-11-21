import React, { useEffect, useState } from 'react'
import axiosHandler from '../../../../handlers/axiosHandler';

function AddCurrency({fetchData}) {

    const [currencyInfo,setCurrencyInfo] = useState({name_english:'',name_arabic:'',symbol:''})
    const [error,setError] = useState()
    function changeHandler (e){
        const {name,value} = e.target
        setCurrencyInfo({...currencyInfo,[name]:value})
    }
    async function submitHandler (e){
        e.preventDefault()
        await axiosHandler({setError,method:'POST',path:'currency/',data:currencyInfo})
        setCurrencyInfo({name_english:'',symbol:'',name_arabic:''})
        fetchData()
    }

    
  return (
    <div>AddCurrency
        <form onSubmit={submitHandler}>
            <label>name in English</label>
            <input type='text' value={currencyInfo.name_english} onChange={changeHandler} name='name_english'/>
            <label>الاسم باللغة العربية</label>
            <input type='text' value={currencyInfo.name_arabic} onChange={changeHandler} name='name_arabic'/>
            <label>Symbol</label>
            <input type='text' value={currencyInfo.symbol} onChange={changeHandler} name='symbol'/>
            <button type='submit'>Submit</button>
        </form>
        {JSON.stringify(error)}

    </div>
  )
}

export default AddCurrency;