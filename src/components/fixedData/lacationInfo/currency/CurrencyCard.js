import React from 'react'
import axiosHandler from '../../../../handlers/axiosHandler';

function CurrencyCard({currency,setEditting,fetchData}) {
  async function deleteHandler (){
    await axiosHandler({method:'DELETE',path:`currency/${currency._id}`})
    fetchData()
  }
  return (
    <div className='border'>
                <h3> {currency?.code}</h3>
                <h3>{currency?.symbol}</h3>
                <h3>{currency?.name_english}</h3>
                <h3>{currency?.name_arabic} </h3>
                <button onClick={()=>{setEditting(currency._id)}}>Edit</button>
                <button onClick={deleteHandler}>Delete</button>
            </div>
  )
}

export default CurrencyCard