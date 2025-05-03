import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name: "socket",
    initialState: {
        socketId: null // Store only the socket ID instead of the whole socket instance
    },
    reducers: {
        setSocketId: (state, action) => {
            state.socketId = action.payload;
        },
        clearSocket: (state) => {
            state.socketId = null;
        }
    }
});

export const { setSocketId, clearSocket } = socketSlice.actions;
export default socketSlice.reducer;