import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: {
        uid: '',
        displayName: '',
        photoURL: '',
        stateMessage: '',
        mainImageURL: ''
    }

}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.currentUser.uid = action.payload.uid;
            state.currentUser.displayName = action.payload.displayName;
            state.currentUser.photoURL = action.payload.photoURL;
            state.currentUser.stateMessage = action.payload.stateMessage;
            state.currentUser.mainImageURL = action.payload.mainImageURL
        },
        clearUser: (state) => {
            state.currentUser = {};
        },

        setPhotoUrl: (state, action) => {
            state.currentUser = {
                ...state.currentUser,
                photoURL: action.payload
            }
        },

        setMainImageUrl: (state, action) => {
            state.currentUser = {
                ...state.currentUser,
                mainImageURL: action.payload
            }
        },

        setStateMessage: (state, action) => {
            state.currentUser = {
                ...state.currentUser,
                stateMessage: action.payload
            }
        },

        setDisplayName: (state, action) => {
            state.currentUser = {
                ...state.currentUser,
                displayName: action.payload
            }
        }
    }
})

export const { setUser, clearUser, setPhotoUrl, setStateMessage, setMainImageUrl, setDisplayName } = userSlice.actions
export default userSlice.reducer