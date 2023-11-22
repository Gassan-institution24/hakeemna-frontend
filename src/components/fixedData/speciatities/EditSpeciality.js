import React, { useEffect, useState } from 'react'
import axiosHandler from '../../../handlers/axiosHandler';
import { connect } from "react-redux";


function EditSpeciality(props) {

    const [selected,setSelected] = useState()
    const [info,setInfo] = useState({name_english:'',name_english:'',description:''})
    const [error,setError] = useState()


    function changeHandler (e){
        const {name,value} = e.target
        setInfo({...info,[name]:value})
    }
    async function submitHandler (e){
        e.preventDefault()
        await axiosHandler({setError,method:'PATCH',path:`specialities/${props.editting}`,data:info})
        setInfo({name_english:'',name_english:'',description:''})
        props.fetchData()
    }

    useEffect(()=>{
        axiosHandler({setData:setSelected,setError,method:'GET',path:`specialities/${props.editting}`})
    },[])
    useEffect(()=>{
        setInfo({name_english:selected?.name_english,name_arabic:selected?.name_arabic,description:selected?.description})
    },[selected])
    
  return (
    <div>EditSpeciality
        <form onSubmit={submitHandler}>
            <label>name english</label>
            <input type='text' value={info.name_english} onChange={changeHandler} name='name_english'/>
            <label>name arabic</label>
            <input type='text' value={info.name_arabic} onChange={changeHandler} name='name_arabic'/>
            <label>description</label>
            <input type='text' value={info.description} onChange={changeHandler} name='description'/>
            <button type='submit'>Submit</button>
        </form>
        {JSON.stringify(error)}
        {JSON.stringify(props.user)}

    </div>
  )
}


const mapStateToProps = (state) => ({
    user: state.user,
    model:state.model
});
const mapDispatchToProps = {  };
export default connect(mapStateToProps, mapDispatchToProps)(EditSpeciality);
