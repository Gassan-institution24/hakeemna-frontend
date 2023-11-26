import React,{ useState } from 'react'
import { connect } from "react-redux";
import { setToken } from '../store/user.store';
import axiosHandler from '../handlers/axiosHandler'

function Login(props) {
  const [userInfo,setUserInfo] = useState({email:'',password:''})
  const [error,setError] = useState()
    function changeHandler (e){
        const {name,value} = e.target
        setUserInfo({...userInfo,[name]:value})
    }
    async function submitHandler (e){
        e.preventDefault()
        await axiosHandler({setData:props.setToken,setError,method:'POST',path:'users/login',data:userInfo})
        setUserInfo({email:'',password:''})
      }
      return (
    <div>welcome
      <form onSubmit={submitHandler}>
            <label>email</label>
            <input type='email' value={userInfo.email} onChange={changeHandler} name='email' />
            <label>password</label>
            <input type='password' value={userInfo.password} onChange={changeHandler} name='password'/>
            <button type='submit'>Submit</button>
        </form>

        {JSON.stringify(props.user)}
        <p>this</p>
        {JSON.stringify(error)}
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user
});
const mapDispatchToProps = {setToken};
export default connect(mapStateToProps, mapDispatchToProps)(Login);