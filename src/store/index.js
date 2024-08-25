import { configureStore } from "@reduxjs/toolkit";
import userReducer from './UserSlice'
import ChatRoomReducer from "./ChatRoomSlice";
import DiaryReducer from './DiarySlice';
import BoardReducer from './BoardSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        chatRoom: ChatRoomReducer,
        diary: DiaryReducer,
        board: BoardReducer,
    }
})