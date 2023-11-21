import { createSlice } from '@reduxjs/toolkit';
const addingEdditingSlice = createSlice({
    name: 'addingAndEditing',
    initialState:{addingCity:false,editingCity:''},
    reducers: {
        setAddingCity (state, action) {
            state.addingCity =  action.payload
        },
        setEditingCity (state, action) {
            state.editingCity =  action.payload
        },
    }
})

export const { setAddingCity,setEditingCity } = addingEdditingSlice.actions;
export default addingEdditingSlice.reducer;