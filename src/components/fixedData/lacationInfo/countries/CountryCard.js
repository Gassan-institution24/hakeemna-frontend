import React from 'react'
import axiosHandler from '../../../../handlers/axiosHandler';

function CountryCard({country,setEditting,fetchData}) {
  async function deleteHandler (){
    await axiosHandler({method:'DELETE',path:`countries/${country._id}`})
    fetchData()
  }
  return (
    <div className='border'>
                <h3> {country?.code}</h3>
                <h3>{country?.name_english}</h3>
                <h3>{country?.name_arabic} </h3>
                <button onClick={()=>{setEditting(country._id)}}>Edit</button>
                <button onClick={deleteHandler}>Delete</button>
            </div>
  )
}

export default CountryCard