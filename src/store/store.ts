import
{
    configureStore,
    createListenerMiddleware,
    createSlice,
    isRejectedWithValue,
    Middleware,
    MiddlewareAPI,
} from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { rehybApi } from './rehybApi'
import { setupListeners } from '@reduxjs/toolkit/query'
import { popupMessageSlice, showPopupMessageAction } from './slices/popupMessageSlice'
import { noteApi } from './noteApi'
import { chatApi } from './chatApi'
import { dataApi } from './dataApi'

// 这段代码创建了一个 Redux Toolkit 的 listenerMiddleware，并设置了一个全局监听器，
// 用于捕获所有分发的 actions。如果任何 action 的 payload 包含 error 属性，它将分发一个显示错误弹窗消息的 action。
// 原先是为了检查API请求的错误，但是现在没有实现只检查API请求的错误，所以检查所有的action的payload中是否有error属性
const listenerMiddleware = createListenerMiddleware()
listenerMiddleware.startListening({
    // This could be done smarter and just catch the API actions. Not sure how though, but this might help.
    // https://redux-toolkit.js.org/api/createListenerMiddleware
    predicate: () => true,  //所有的action都会被监听
    effect: async (action, listenerApi) =>
    {
        if (action?.payload?.error)
        {   //showPopupMessageAction的参数是传给异步函数(message: Message) => {}的参数
            listenerApi.dispatch(showPopupMessageAction({ text: action?.payload?.error, type: 'ERROR' }))
        }
    },
})


// See how this magic works here: https://redux-toolkit.js.org/rtk-query/overview
export const store = configureStore({
    reducer: {
        popupReducer: popupMessageSlice.reducer,    //store中有关popup状态的属性名是popupReducer，因为它以键值对形式指明了属性名和reducer
        userReducer,    //store中有关user状态的属性名是userReducer，因为它不是按键值对的形式，所以不需要写成userReducer:userReducer
        [rehybApi.reducerPath]: rehybApi.reducer,
        [noteApi.reducerPath]: noteApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        [dataApi.reducerPath]: dataApi.reducer,
        // noteApi: noteApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(rehybApi.middleware)
            .concat(noteApi.middleware)
            .concat(chatApi.middleware) // Ensure middleware is properly typed
            .concat(dataApi.middleware)
            .prepend(listenerMiddleware.middleware),    //.prepend(api.middleware): 这个方法会将你的自定义中间件添加到默认中间件数组的开头。这意味着你的自定义中间件将在默认中间件之前执行。
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)

// store.subscribe(() => console.log(store.getState()));

export type RootState = ReturnType<typeof store.getState>   //store.getState是函数，ReturnType是一个工具类型，用于获取函数返回值的类型
export type AppDispatch = typeof store.dispatch //store.dispatch是函数，所以AppDispatch是一个函数类型

// Use throughout your app instead of plain `useDispatch` and `useSelector`，应该放在单独的文件中，避免潜在的循环导入依赖问题
export const useAppDispatch: () => AppDispatch = useDispatch
//TypedUseSelectorHook是react-redux库中的一个类型定义，用于创建一个类型化的useSelector钩子。这个类型化的钩子允许你在使用useSelector时自动获得state的类型推断，这样可以提高代码的类型安全性和减少类型错误。
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector