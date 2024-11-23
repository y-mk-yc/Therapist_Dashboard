//uselocation是一个hook，返回当前url的location对象，包含当前url的pathname，search，hash，state等信息,useNavigate是一个hook，返回一个navigate函数，用于在应用中进行导航
import {useLocation, useNavigate} from 'react-router-dom'
import {useEffect} from 'react'
//useDispatch是一个hook，返回一个dispatch函数，用于向redux store分发action，useSelector是一个hook，返回redux store的state，用于从redux store中提取数据
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../store/store'
//insert once the admin has been part has been figured out
//import {Admin, GetMeApiResponse, rehybApi, Therapist} from "../../store/rehybApi";
import {rehybApi} from "../../store/rehybApi";
import {isLoggedIn, login, logout} from "../../store/slices/userSlice";
// import {retry} from "@reduxjs/toolkit/query";


//TODO: update this code so the login procedure works accordingly with the updated endpoint calls

export const useLoginRedirect = () => {
    const user = useSelector((state: RootState) => state.userReducer.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation();

    const [getMe, lastPromiseInfo] =
        rehybApi.endpoints.getMe.useLazyQuery()   //lastPromiseInfo是一个对象，包含了UseQueryStateResult类型的对象，命名错了

    useEffect(() => {
        let redirectDone = false;
        const testLoggedIn = async () => {
            const result = await getMe() //如果Cookie中有已经登录过的TherapistID

            if (result.isError) {
                dispatch(logout())
                // console.log("执行了logout(),user变为NOT_LOGGED_IN")
            } else if (result.data) {

                const data = result.data

                dispatch(login({
                    name: data.Name,
                }))
                // console.log("执行了login(),user变为LoggedInUser")

            }
        }
        // console.log("state:",user);
        // console.log("pathname:",location.pathname)
        // console.log("Cookies of TherapistID:",Cookies.get('TherapistID'));

        if (user == 'NOT_LOGGED_IN' && location.pathname != '/login') {
            // console.log("user is NOT_LOGGED_IN, 路径不是/login，redirect to login")
            navigate('/login')
        } else if (isLoggedIn(user) && !redirectDone && location.pathname == '/login') {
            // console.log("user is LoggedInUser, 路径是/login，redirect to /")
            navigate('/')
            redirectDone = true;

        } else if (user == 'UNKNOWN') {
            // console.log("user is UNKNOWN, testLoggedIn()，执行getMe()")
            testLoggedIn()
        }
        return () => {
            redirectDone = false;
        };
    }, [user, location])
}