import {createAsyncThunk, createSlice, PayloadAction, ThunkDispatch} from '@reduxjs/toolkit'


export type ViewType = 'IN_CLINIC' | 'AT_HOME'  //ViewType是一个字符串类型，只能是'IN_CLINIC'或'AT_HOME'

export type LoggedInUser = {    //LoggedInUser是一个对象类型，包含name和settings属性
    //isAdmin: boolean
    name: string
    settings: {
        viewType: ViewType
    }
}

export const isLoggedIn = (user: UserState['user']): user is LoggedInUser => {  //isLoggedIn如果是true,则user是LoggedInUser类型
    return (<LoggedInUser>user).name !== undefined
}
export type UserState = {
    user: LoggedInUser | 'NOT_LOGGED_IN' | 'UNKNOWN'
}

const initialState: UserState = {
    user: 'UNKNOWN'
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setViewType: (state, action: PayloadAction<ViewType>) => {
            if (!isLoggedIn(state.user)) return;

            if (!state.user?.settings) return
            state.user.settings.viewType = action.payload
        },
        login: (state, action: PayloadAction<{name: string}>) => { //isAdmin: boolean, name: string }>) => {
            state.user = {
                //isAdmin: action.payload.isAdmin,
                name: action.payload.name,
                // settings: {viewType: 'IN_CLINIC'}
                settings: {viewType: 'AT_HOME'} //默认是AT_HOME 模式
            }
        },
        logout: (state) => {
            state.user = 'NOT_LOGGED_IN'
        }
    },
})

export const {login, logout, setViewType} = userSlice.actions
export default userSlice.reducer