import React from 'react'
import { connect } from "react-redux";
import axiosHandler from '../../../handlers/axiosHandler';

function SpecialityCard(props) {
  async function deleteHandler (){
    await axiosHandler({method:'DELETE',path:`specialities/${props.one._id}`})
    props.fetchData()
  }
  return (
    <div className='border'>
                <h3> {props.one.code}</h3>
                <h3>{props.one.name_english}</h3>
                <h3>{props.one.name_arabic}</h3>
                <h3>{props.one.description} </h3>
                <button onClick={()=>{props.setEditting(props.one._id)}}>Edit</button>
                <button onClick={deleteHandler}>Delete</button>
            </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
  model:state.model
});
const mapDispatchToProps = { };
export default connect(mapStateToProps, mapDispatchToProps)(SpecialityCard);