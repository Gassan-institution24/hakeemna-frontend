import React from 'react'
import { connect } from "react-redux";
import axiosHandler from '../../../handlers/axiosHandler';

function DiseaseCard(props) {
  async function deleteHandler (){
    await axiosHandler({method:'DELETE',path:`medicines/${props.one._id}`})
    props.fetchData()
  }
  return (
    <div className='border'>
                <h3> {props.one.code}</h3>
                <h3>{props.one.trade_name}</h3>
                <h3>{props.one.concentration} </h3>
                <h3>{props.one.side_effects} </h3>
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