import React from 'react'
import { connect } from "react-redux";
import axiosHandler from '../../../handlers/axiosHandler';

function AnalysisCard(props) {
  async function deleteHandler (){
    await axiosHandler({method:'DELETE',path:`analysis/${props.analysis._id}`})
    props.fetchData()
  }
  return (
    <div className='border'>
                <h3> {props.analysis.code}</h3>
                <h3>{props.analysis.name}</h3>
                <h3>{props.analysis.description} </h3>
                <button onClick={()=>{props.setEditting(props.analysis._id)}}>Edit</button>
                <button onClick={deleteHandler}>Delete</button>
            </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
  model:state.model
});
const mapDispatchToProps = { };
export default connect(mapStateToProps, mapDispatchToProps)(AnalysisCard);