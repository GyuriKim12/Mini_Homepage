import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentBoard: {
        createdDate: '',
        content: '',
        title: '',
        photoURL: ''
    }

}

export const BoardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        setPhoto: (state, action) => {
            state.currentPicture = action.payload
        }
    }
})

export const { setPhoto } = BoardSlice.actions
export default BoardSlice.reducer