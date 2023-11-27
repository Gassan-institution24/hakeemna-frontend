import React, { useState } from 'react'
import { connect } from "react-redux";
import { setToken } from '../store/user.store';
import axiosHandler from '../handlers/axiosHandler'

function Signup(props) {
    const [userInfo,setUserInfo] = useState({})
    const [error,setError] = useState()
    function changeHandler (e){
        const {name,value} = e.target
        setUserInfo({...userInfo,[name]:value})
    }
    async function submitHandler (e){
        e.preventDefault()
        await axiosHandler({setData:props.setToken,setError,method:'POST',path:'users/signup',data:userInfo})
        setUserInfo({name:'',email:'',password:'',confirmPassword:'',role:''})
        //console.log(props.user);
    }
    //console.log(props.user);
    
    
  return (
    <div>Signup
        <form onSubmit={submitHandler}>
            <label>name</label>
            <input type='text' value={userInfo.name} onChange={changeHandler} name='name'/>
            <label>email</label>
            <input type='email' value={userInfo.email} onChange={changeHandler} name='email' />
            <label>password</label>
            <input type='password' value={userInfo.password} onChange={changeHandler} name='password'/>
            <label>confirmPassword</label>
            <input type='password' value={userInfo.confirmPassword} onChange={changeHandler} name='confirmPassword'/>
            <label>role</label>
            <select value={userInfo.role} onChange={changeHandler} name='role'>
                <option defaultChecked >customer</option>
                <option>admin</option>
                <option>super admin</option>
                <option>stakeholder</option>
                <option>insurance</option>
            </select>
            <button type='submit'>Submit</button>
        </form>
        {JSON.stringify(error)}
        {JSON.stringify(props.user)}

    </div>
  )
}

const mapStateToProps = (state) => ({
    user: state.user
});
const mapDispatchToProps = { setToken };
export default connect(mapStateToProps, mapDispatchToProps)(Signup);