import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentDiary: {
        createdDate: '',
        emotionID: '',
        content: '',
    }

}

export const DiarySlice = createSlice({
    name: 'diary',
    initialState,
    reducers: {

    }
})

export default DiarySlice.reducer