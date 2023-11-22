import React, { useEffect, useState } from 'react'
import axiosHandler from '../../../handlers/axiosHandler';
import { connect } from "react-redux";


function EditFamily(props) {

    const [selected,setSelected] = useState()
    const [info,setInfo] = useState({name:'',description:''})
    const [error,setError] = useState()


    function changeHandler (e){
        const {name,value} = e.target
        setInfo({...info,[name]:value})
    }
    async function submitHandler (e){
        e.preventDefault()
        await axiosHandler({setError,method:'PATCH',path:`drugfamilies/${props.editting}`,data:info})
        setInfo({name:'',description:''})
        props.fetchData()
    }

    useEffect(()=>{
        axiosHandler({setData:setSelected,setError,method:'GET',path:`drugfamilies/${props.editting}`})
    },[])
    useEffect(()=>{
        setInfo({name:selected?.name,description:selected?.description})
    },[selected])
    
  return (
    <div>EditFamily
        <form onSubmit={submitHandler}>
            <label>name</label>
            <input type='text' value={info.name} onChange={changeHandler} name='name'/>
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
export default connect(mapStateToProps, mapDispatchToProps)(EditFamily);
