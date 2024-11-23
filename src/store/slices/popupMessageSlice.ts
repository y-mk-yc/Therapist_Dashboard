import {configureStore, createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {isLoggedIn, userSlice, ViewType} from "./userSlice";

export const showPopupMessageAction = createAsyncThunk(
    'popupMessage/showMessage',
    async (message: Message) => {
        return new Promise<Message>((resolve, reject) => {
            setTimeout(() => {
                resolve(message)
            }, 4000)
        })
    }
)

type Message = {
    type: 'ERROR' | 'INFO'
    text: string
}

type PopupMessageState = {
    message: undefined | Message
}

export const popupMessageSlice = createSlice({
        name: 'popupMessage',
        initialState: {message: undefined} as PopupMessageState,
        reducers: {},
        extraReducers: builder => {
            builder.addCase(showPopupMessageAction.pending, (state, action) => {
                state.message = action.meta.arg
            })
            builder.addCase(showPopupMessageAction.fulfilled, (state, action) => {
                state.message = undefined
            })
        }
    }
)