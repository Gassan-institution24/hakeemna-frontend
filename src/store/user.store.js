// user.store.js
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import axiosHandler from '../handlers/axiosHandler';
import { jwtDecode } from 'jwt-decode';

const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, loading: false, error: null },
  reducers: {
    setToken: (state, action) => {
      Cookies.set('user_token', action.payload.token);
    },
    setUser: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
      //console.log(action)
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setToken,setUser, setLoading, setError } = userSlice.actions;

export const fetchUserData = () => async (dispatch) => {
  dispatch(setLoading());
  try {
    const userToken = Cookies.get('user_token');
    if(userToken){
      const decodedToken = jwtDecode(userToken);
      const response = await axiosHandler({
        method: 'GET',
        path: `users/${decodedToken.id}`,
      });
      //console.log(response)
      dispatch(setUser(response.data));
    }
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export default userSlice.reducer;
