import { createSlice } from '@reduxjs/toolkit';
const userSlice = createSlice({
    name: 'user',
    initialState:{},
    reducers: {
        set (state, action) {
            state.data= action.payload
        },
    }
})

export const { set } = userSlice.actions;
export default userSlice.reducer;