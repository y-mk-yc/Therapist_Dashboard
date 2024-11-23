import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {getUrl} from "../urlPicker";  //获得当前的url

export const emptySplitApi = createApi({
    baseQuery: fetchBaseQuery(
        {
            credentials: 'include',
            prepareHeaders: (headers) => {
                //这里设置一些统一的headers
                return headers;
            },
            baseUrl: getUrl()
        }),
    endpoints: () => ({}),
})

//baseQuery可以自己定义，如果自己定义,它应该返回一个对象，要么有一个data属性，要么有一个error属性，或者一个promise，它会resolve到一个这样的对象