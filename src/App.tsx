import {createBrowserRouter, Outlet, RouterProvider} from 'react-router-dom'
import {Navbar} from './navbar/Navbar'
import {Dashboard} from './dashboard/Dashboard'
import {Patients} from './patients/Patients'
import {Exercises} from './exercises/Exercises'
import {PatientDetail} from './patients/detail/PatientDetail'
import {Overview} from './patients/detail/overview/Overview'
import {Data} from './patients/detail/data/Data'
import {store, useAppSelector} from './store/store'
import {Provider} from 'react-redux'
import {PatientExercises} from './patients/detail/exercises/Exercises'
import {Login} from './login/Login'
import {useLoginRedirect} from './common/hooks/authHooks'
import {Signup} from './login/SignUp'
//import {Admin} from './admin/admin'
import {isLoggedIn} from "./store/slices/userSlice";
import {Loader} from "./common/Loader";
import {usePrevious} from "./common/hooks/utilityHooks";
import {useEffect, useState} from "react";
import {UrlPicker} from "./urlPicker";

import {useLocation, useNavigate} from 'react-router-dom'
import {Test} from "./Test/Test";

//////////测试
// function MyComponent() {
//     const location = useLocation();
//
//     return (
//         <div>
//             <p>当前路径名: {location.state+location.key}</p>
//         </div>
//     );
// }
//
// function MyComponent2() {
//     const navigate = useNavigate();
//
//     function handleClick() {
//         navigate("/login/login2");
//     }
//
//     return (
//         <button onClick={handleClick}>点击这里跳转到首页</button>
//     );
// }
//////////测试

const Root = () => {
    useLoginRedirect()
    const user = useAppSelector(state => state.userReducer.user)

    const message = useAppSelector(state => state.popupReducer.message)

    // Trickery to hide dialog smoothly
    const [hidden, setHidden] = useState(true)
    useEffect(() => {
        if (message) setHidden(false)
        else setTimeout(() => {
            setHidden(true)
        }, 700)
    }, [message])


    const prevMessage = usePrevious<typeof message>(message)
    if (!isLoggedIn(user)) return <Loader/>

    return (
        <>
            <div className="flex w-full items-stretch min-h-screen">
                <Navbar/>
                <div className="from-[#F2F4FB] to-white bg-gradient-to-b flex-1 w-full">
                    <Outlet/>
                </div>
            </div>
            {<div className={`fixed bottom-0 w-full flex justify-center ${hidden ? 'h-0' : 'h-fit'}`}>
                <div className={`mb-8 py-4 px-8 text-xl bg-negative text-white rounded shadow-xl z-40 duration-700 transition-all
                ${message ? 'opacity-100' : 'opacity-0'}`

                }>
                    {message && message.text}
                    {!message && prevMessage && prevMessage.text}
                </div>
            </div>}
        </>
    )
}

const router = createBrowserRouter([
    //Why do we have an admin page? and this is only temporarily commented out
    /*{
        path: 'admin',
        element: <Admin/>
    },*/
    {
        path: 'login',
        element: <Login/>
    },

    {
        path: 'signup',
        element: <Signup/>
    },

    {
        path: '/',
        element: <Root/>,
        children: [
            {
                index: true,
                element: <Dashboard/>
            },
            {
                path: 'patients',
                element: <Patients/>,
            },
            // I believe I can't put it as children of patients because I'd need an <Outlet/> in Patients
            {
                path: 'patients/:patientId', //onClick={() => navigate(props.patient.PatientID)} in Patients.tsx
                element: <PatientDetail/>,
                children: [
                    {
                        index: true,
                        element: <Overview/>
                    },
                    {
                        path: 'data',
                        element: <Data/>
                    },
                    {
                        path: 'exercises',
                        element: <PatientExercises/>
                    }
                ]
            },
            {
                path: 'exercises',
                element: <Exercises/>
            },
            // {
            //     path:'test',
            //     element:<Test/> //测试,链接在navbar/Navbar.tsx TODO：记得处理
            // }

        ]
    },
]);

//<UrlPicker />是一个右上角的下拉框，可以选择不同的server
function App() {
    return <Provider store={store}>
        <UrlPicker/>
        <RouterProvider router={router}/>
    </Provider>
}

export default App

