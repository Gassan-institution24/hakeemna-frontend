import React from 'react'
const Stackholderupdate = () => {
  const Update = (id) => {
    axiosHandler({
      setError,
      method: "PUT",
      path: `stackholder/${id}`,
    })
  }
  return (
    <div>
      <h2>update</h2>
      <input></input>
      <button onClick={()=>Update(info._id)}>Update</button>
    </div>
  )
}

export default Stackholderupdate
