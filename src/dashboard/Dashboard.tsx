import React, { FC, useState } from 'react'
// import { TherapistSection } from './components/TherapistSection'
import
{
    // GetOverviewApiResponse,
    // useGetOverviewQuery,
    useGetActivityStatusQuery,
    // GetActivityStatusResponse,
    // getTherapistIDFromCookie,
    // InlineResponse2004
} from '../store/rehybApi'
import { Loader } from '../common/Loader'
// import { YourPatients } from "./components/YourPatients";
// import { Events } from "./components/Events";
import { DoctorWelcome } from "./components/DoctorWelcome";
// import { PatientsActivities } from "./components/PatientsActivities";
import { PatientsAtDate } from "./components/PatientsAtDate";
// import { useAppSelector } from "../store/store";
import { TitledSection } from "./components/TitledSections";
import { Schedule } from "./components/Schedule";
import { ToastContainer } from 'react-toastify';
// import { LoggedInUser } from "../store/slices/userSlice";
// import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';
import { DashboardNotes } from './components/DashBoardNotes';

export const Dashboard = () =>
{
    const {
        data: yourPatientsPanelData,
        isLoading,
        error
    } = useGetActivityStatusQuery(); //获取online, offline, exercising的患者数量

    //const view = useAppSelector(state => (state.userReducer.user as LoggedInUser).settings.viewType) ?? 'IN_CLINIC'

    if (isLoading)
    {
        return <div className='flex justify-center m-32'><Loader /></div>
    }

    if (!yourPatientsPanelData || error)
    {
        return <div>Error</div>
    }

    // return (view == 'AT_HOME') ? <AtHomeLayout data={yourPatientsPanelData} /> :
    //     <AtClinicLayout data={yourPatientsPanelData} />
    return (<AtClinicLayout />)
}
const AtClinicLayout = () =>
{
    // const [selectedDate, setSelectedDate] = useState<Value>(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())
    //将setSelectedDate函数作为props传递给Schedule组件，所以selectedDate的值会随着Schedule组件的选择而改变
    //selectedDate是一个Date对象,是现在的时间，setSelectedDate是一个函数，用于改变selectedDate的值

    return <div className={'flex flex-wrap min-h-screen p-10 justify-between gap-x-20'}>
        <div className='flex-col flex-1 '>

            {<DoctorWelcome />}
            <TitledSection title={'Patient activities'}>
                <div className='card flex flex-col gap-2'>
                    <div className='flex bg-background-light rounded-xl py-2 px-4 gap-4'>
                        <span>No activities</span>
                    </div>
                </div>
            </TitledSection>

            <DashboardNotes />
        </div>
        <div className='flex-1'>
            <TitledSection title={'Schedule'} className={'flex-1'}>
                <div className={'card flex flex-col items-end gap-2'}>
                    <Schedule onDateSelected={setSelectedDate} showAddPointment={true} />
                </div>
            </TitledSection>
            <PatientsAtDate selectedDate={selectedDate} />

        </div>
        <div className='absolute'>
            <ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>

    </div>
}


/*以下，“我”代表登录的医生，YourPatients组件展示了我所有负责的患者的信息，包括患者的头像、姓名、状态（在线/离线）等。不管是在诊所还是在家，我都可以看到这些信息。
也不管具体的exercise时间，YourPatients就是跟我有关的所有患者的信息，所以这个组件是不需要根据时间变化而变化的。

PatientsAtDate组件是根据我选择的日期来展示某一天的患者的信息，包括患者的头像、姓名、状态（在线/离线）等。这个组件是需要根据时间变化而变化的。
所以，PatientsAtDate组件需要一个selectedDate属性，用于记录我选择的日期。当我选择了一个新的日期，PatientsAtDate组件就会根据这个日期来展示患者的信息。

 */