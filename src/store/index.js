import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import userSlice from './user.store'
import addingEdditingSlice from './addingAndEditing.store';
const reducer = combineReducers({
    user: userSlice,
    model:addingEdditingSlice
})
const store = configureStore({ reducer })
export default store;