import axios from 'axios';
import Cookies from 'js-cookie';

export default async function axiosHandler({
  setData,
  setError,
  method,
  path,
  data,
}) {
    const url = `http://localhost:3000${path}`;
    const token = Cookies.get('user_token');
    const response = await axios({
      method,
      url,
      headers: {
        authorization: `Bearer ${token}`,
      },
      data,
    });
    if (response.status === 200 || 304 ) {
      if(setData){
        setData(response.data);
      }
      return response;
    }
    if (setError) {
      setError(response.data);
    }
    return response;
}
