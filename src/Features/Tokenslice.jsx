import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  Role: '',
  Username: '',
  tokenid: '',
  userloggedin:'',
}

export const Tokenslice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    changetoken: (state, action) => {
      const { Role, Username, Tokenid } = action.payload;
      state.Role = Role;
      state.Username = Username;
      state.tokenid = Tokenid;
      state.userloggedin = action.payload;
    },
    
  },
})

// Action creators are generated for each case reducer function
export const { changetoken } = Tokenslice.actions

export default Tokenslice.reducer
