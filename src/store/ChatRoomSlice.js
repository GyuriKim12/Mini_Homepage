import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentChatRoom: {
        createdBy: {
            id: '',
            image: '',
            name: ''
        },
        participant: {
            id: '',
            image: '',
            name: ''
        },
        description: '',
        id: '',
        name: ''
    }
};

export const ChatRoomSlice = createSlice({
    name: 'chatRoom',
    initialState,
    reducers: {
        setCurrentChatRoom: (state, action) => {
            state.currentChatRoom = action.payload
        },
        setChatRoomName: (state, action) => {
            state.currentChatRoom = {
                ...state.currentChatRoom,
                name: action.payload
            }
        }
    }
})

export const { setCurrentChatRoom, setChatRoomName } = ChatRoomSlice.actions
export default ChatRoomSlice.reducer