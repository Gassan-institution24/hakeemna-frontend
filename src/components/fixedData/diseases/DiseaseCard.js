import React from 'react'
import { connect } from "react-redux";
import axiosHandler from '../../../handlers/axiosHandler';

function DiseaseCard(props) {
  async function deleteHandler (){
    await axiosHandler({method:'DELETE',path:`diseases/${props.one._id}`})
    props.fetchData()
  }
  return (
    <div className='border'>
                <h3> {props.one.code}</h3>
                <h3>{props.one.name}</h3>
                <h3>{props.one.category} </h3>
                <h3>{JSON.stringify(props.one.symptoms)} </h3>
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
export default connect(mapStateToProps, mapDispatchToProps)(DiseaseCard);