import axios from 'axios';
import Cookies from 'js-cookie';

import { HOST_API } from 'src/config-global';

export default async function axiosHandler({ setData, setError, method, path, data }) {
  const url = `${HOST_API}${path}`;
  const token = Cookies.get('user_token');
  const response = await axios({
    method,
    url,
    headers: {
      authorization: `Bearer ${token}`,
    },
    data,
  });

  if (setData) {
    setData(response.data);
  }

  if (setError) {
    setError(response.data);
  }
  return response;
}
