import axios from "axios";
import Cookies from "js-cookie";

export default async function axiosHandler({setData:setData,setError:setError,method:method, path:path, data:data}) {
    try{
        const url = "http://localhost:3000/api/" + path;
        const token = Cookies.get("user_token");
        const response = await axios({
          method: method,
          url: url,
          headers: {
            authorization: `Bearer ${token}`,
          },
          data: data,
      });
        if(response.status ===200){
          if(setData){
            setData(response.data)
          }
          return response
        }else{
          if(setError){
            console.log(response)
            setError(response.data)
          }
        }
    } catch(err){
        console.log(err)
        if(setError){
          setError(err.message)
        }
    }
}