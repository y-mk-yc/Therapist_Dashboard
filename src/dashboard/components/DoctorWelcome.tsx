import React, { useEffect } from "react";
import {useAppSelector} from "../../store/store";
import {ViewSwitch} from "./ViewSwitch";
import helloImg from './hello.svg'
import {AiOutlineLogout} from "react-icons/ai";
import {useDispatch} from "react-redux";
import {LoggedInUser, logout} from "../../store/slices/userSlice";
import {useGetMeQuery} from "../../store/rehybApi";
import Cookies from 'js-cookie';


export const DoctorWelcome = () => {
    const view = useAppSelector(state => (state.userReducer.user as LoggedInUser).settings.viewType)

    return <div className='card bg-secondary2 flex mb-5 items-stretch justify-between p-0 h-full flex-wrap'>
        {view == 'AT_HOME' && <WelcomeMessage/>}
        {view == 'IN_CLINIC' && <AtClicDoctorWelcomeInner/>}
    </div>
}

const AtClicDoctorWelcomeInner = () => {
    const dispatch = useDispatch()
    // const [logoutCall, data] = usePostMeLogoutMutation()
    const { data: userData, isSuccess } = useGetMeQuery();

    const onLogout = () => {
        // await logoutCall()
        Cookies.remove('TherapistID');  //清除cookie,后续的session就通不过后端的验证了
        Cookies.remove('Token');
        dispatch(logout())
    }

    return <>
        <div className='flex items-center gap-4 p-6'>
            {userData?.Picture && <img src={userData?.Picture} alt="Profile" className="h-48 w-48 self-end object-top"/>}
            <div className={'flex flex-col [&>*]:text-white self-center gap-2'}>
                <h1 className={'font-bold'}>Dr. {userData?.Name}</h1>
                <ViewSwitch/>
            </div>
        </div>
        <div className={'flex gap-4'}>
            <WelcomeMessage/>
            <button onClick={onLogout} className={'btn-icon mx-10 self-center'}><AiOutlineLogout/></button>
        </div>

    </>
}

const WelcomeMessage = () => {
    const { data: userData, isSuccess } = useGetMeQuery();

    return <div className={'flex h-full w-full justify-around min-h-[140px] items-center px-4'}>
        <div className='flex flex-col [&>*]:text-white'>
            <span>Welcome, </span>
            <b>{userData?.Name}</b>
            <span>have a nice day!</span>
        </div>
        <img src={helloImg} alt="hello" className={'h-32 w-16 self-end object-top'}/>
    </div>
}