import {AiOutlineLogout} from 'react-icons/ai'
import {useDispatch} from 'react-redux'
import {logout} from '../../store/slices/userSlice'
import {ViewSwitch} from "./ViewSwitch";
import {BoxedSchedule, Schedule} from "./Schedule";
import {useGetMeQuery} from "../../store/rehybApi";
import Cookies from "js-cookie";

const blueBoxStyle = 'flex flex-col bg-tertiary rounded-xl px-5 py-10'
export const TherapistSection = (props: { onDateSelected: (newDate: Date) => void }) => {
    const dispatch = useDispatch()
    // const [logoutCall, data] = usePostMeLogoutMutation()
    const { data: userData, isSuccess } = useGetMeQuery();

    const onLogout = () => {
        // await logoutCall()
        Cookies.remove('TherapistID');
        Cookies.remove('Token');
        dispatch(logout())
    }

    return <div className='flex flex-col bg-white flex-1 shadow shadow-white p-6 gap-6'>
        <div className={`${blueBoxStyle} items-center`}>
        {userData?.Picture && <img src={userData?.Picture} alt="Profile" className="h-48 w-48 mx-auto"/>}
            <b>Dr. {userData?.Name}</b>
            <div className={'mt-5'}>
                <ViewSwitch/>
            </div>
            <button className={'btn-secondary mt-4'} onClick={onLogout}>Log out <AiOutlineLogout/></button>
        </div>
        <BoxedSchedule onDateSelected={props.onDateSelected}/>
    </div>
}