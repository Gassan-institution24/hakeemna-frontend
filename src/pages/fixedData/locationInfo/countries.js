import React, { useEffect, useState } from 'react'
// import { connect } from "react-redux";
// import { set } from '../../../store/user.store';
// import { setAddingCity } from '../../../store/addingAndEditing.store';
import axiosHandler from '../../../handlers/axiosHandler';
import AddCountry from '../../../components/fixedData/lacationInfo/countries/AddCountry';
import CountryCard from '../../../components/fixedData/lacationInfo/countries/CountryCard';
import EditCountry from '../../../components/fixedData/lacationInfo/countries/EditCountry';

function Countries() {
    const [isAdding,setIsAdding]=useState(false)
    const [editting,setEditting]=useState('')
    const [countries,setCountries] = useState()
    const [error,setError] = useState()


    const fetchData = async()=>{
        await axiosHandler({setData:setCountries,setError:setError,method:'GET',path:'countries/'}) 
    }
    console.log('Countries', countries)
    useEffect(()=>{
        fetchData()
    },[])
    
  return (
    <div>Countries
        {isAdding && <AddCountry setIsAdding ={setIsAdding} fetchData={fetchData}/>}
        {editting && <EditCountry setEditting={setEditting} editting={editting} fetchData={fetchData}/>}
        <button onClick={()=>{setIsAdding(!isAdding)}}>Add</button>
        {countries?.map((country,idx)=>{
            return(<CountryCard key={idx} setEditting={setEditting} fetchData={fetchData} country={country}/>)
        })}

    </div>
  )
}

// const mapStateToProps = (state) => ({
//     user: state.user,
//     model:state.model
// });
// const mapDispatchToProps = { set,setAddingCity };
// export default connect(mapStateToProps, mapDispatchToProps)(Countries);
export default Countries