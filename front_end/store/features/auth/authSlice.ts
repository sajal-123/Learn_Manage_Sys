import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    token: "",
    user: ""
}

const authSlice = createSlice({
    name: "auth",
    initialState, // Corrected spelling here
    reducers: {
        userRegistration: (state, action) => {
            state.token = action.payload.token
        },
        userLoggedIn: (state, action) => {
            state.token = action.payload.accessToken
            state.user = action.payload.user
        },
        userLoggedOut: (state) => {
            state.token = "" // Corrected state update
            state.user = ""  // Corrected state update
        },
    }
})

export const { userRegistration, userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;
