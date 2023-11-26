import { configureStore,getDefaultMiddleware } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { combineReducers } from 'redux';
import userSlice from './user.store'
import addingEdditingSlice from './addingAndEditing.store';
const reducer = combineReducers({
    user: userSlice,
    model:addingEdditingSlice
})
const store = configureStore({
    reducer,
    middleware: [...getDefaultMiddleware(), thunk],
  });
  
export default store;