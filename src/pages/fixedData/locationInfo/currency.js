import React, { useEffect, useState } from 'react'
import axiosHandler from '../../../handlers/axiosHandler';
import AddCurrency from '../../../components/fixedData/lacationInfo/currency/AddCurrency';
import CurrencyCard from '../../../components/fixedData/lacationInfo/currency/CurrencyCard';
import EditCurrency from '../../../components/fixedData/lacationInfo/currency/EditCurrency';

function Currency() {
    const [isAdding,setIsAdding]=useState(false)
    const [editting,setEditting]=useState('')
    const [currency,setCurrency] = useState()
    const [error,setError] = useState()


    const fetchData = async()=>{
        await axiosHandler({setData:setCurrency,setError:setError,method:'GET',path:'currency/'}) 
    }
    console.log('currency', currency)
    useEffect(()=>{
        fetchData()
    },[])
    
  return (
    <div>currency
        {isAdding && <AddCurrency setIsAdding ={setIsAdding} fetchData={fetchData}/>}
        {editting && <EditCurrency setEditting={setEditting} editting={editting} fetchData={fetchData}/>}
        <button onClick={()=>{setIsAdding(!isAdding)}}>Add</button>
        {currency?.map((currency,idx)=>{
            return(<CurrencyCard key={idx} setEditting={setEditting} fetchData={fetchData} currency={currency}/>)
        })}

    </div>
  )
}

export default Currency