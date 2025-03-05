import { Loader } from "../../common/Loader";
import { getDateString, isDateToday, shortTime } from "../../common/dateUtils";
import { TiDeleteOutline } from "react-icons/ti";
import { TitledSection } from "./TitledSections";
// import React, { useEffect } from "react";
import
{
    AppInfo,
    useDeleteAppointmentsByAppointmentIdMutation,
    // InlineResponse2004,
    useGetAppointmentsByTherapistIdAndDateQuery,
    // useGetOverviewQuery,
} from "../../store/rehybApi";
// import { defaultOrImgSrc } from "../../common/utils";
import { NavLink } from "react-router-dom";
import { setLocalNoonToISOString } from "../../common/ISOTimeAdjustment";

export const PatientsAtDate = (props: { selectedDate: Date }) =>
{ //显示一个日期的appointments
    // { data, isError, isLoading, isFetching } = useGetOverviewQuery()
    //useGetOverviewQuery需要根据当前的日期来获取数据，所以需要传递一个参数
    //////////////////////////mock data////////////////////////


    //////////////////////////mock data////////////////////////
    // const events: InlineResponse2004PatientActivities[] = data?.patientActivities ?? []
    // if (isLoading) {
    //     return <Loader/>
    // }
    // if (isError) {
    //     return <div className='flex items-center gap-x-3 gap-y-0.5 flex-wrap'>
    //         <div
    //             className='flex bg-background-light rounded-xl py-2 px-4 gap-4 flex-1 cursor-default transition-all'>
    //             <span>Error</span>
    //         </div>
    //     </div>
    // }
    const [deleteAppointment] = useDeleteAppointmentsByAppointmentIdMutation()
    const handleAppointmentDelete = async (appointment: any) =>
    {
        try
        {
            const result = await deleteAppointment({ ID: appointment._id })
            console.log({ result })


        } catch (e)
        {
            console.log("Delete appointment failed:", e)
        }

    }
    const {
        data,
        isLoading,
        isError
    } = useGetAppointmentsByTherapistIdAndDateQuery({ StartDate: setLocalNoonToISOString(props.selectedDate).split('T')[0] }) //根据当前的日期来获取数据
    const title = isDateToday(props.selectedDate) ?
        'Patients Today' : `Patients on ${getDateString(props.selectedDate)}`

    return <TitledSection title={title}>
        <div className='card flex flex-col gap-2 overflow-auto max-h-[400px] min-w-[300px]'>
            {isLoading && <Loader />}
            {isError && <div className='flex items-center gap-x-3 gap-y-0.5 flex-wrap'>
                <div
                    className='flex bg-background-light rounded-xl py-2 px-4 gap-4 flex-1 cursor-default transition-all'>
                    <span>Error</span>
                </div>
            </div>}
            {!(isLoading || isError || data?.length) && //?运算符的作用是判断data是否为null或者undefined，如果是，就返回undefined，否则返回data.length
                <div className='flex items-center gap-x-3 gap-y-0.5 flex-wrap'>
                    <div
                        className='flex bg-background-light rounded-xl py-2 px-4 gap-4 flex-1 cursor-default transition-all'>
                        <span>No Appointments</span>
                    </div>
                </div>
            }
            {!(isLoading || isError) && data && data.length > 0 && data.map(appointment =>
            {
                const date = `${shortTime(new Date(appointment.Starts))} - ${shortTime(new Date(appointment.Ends))}`; //获得一个appointment的开始时间到结束时间
                // const date = `${shortTime(new Date(appointment.StartTime))} - ${shortTime(parseDateOrToday(event.exercise.to))}`; //获得一个exercise的开始时间到结束时间

                return <div className="flex gap-x-3 w-full">
                    <NavLink to={`patients/${appointment.PatientID}`}
                        className={'flex flex-1 items-center gap-x-3 gap-y-0.5 flex-wrap'} key={appointment.PatientID}>
                        <span>{date}</span>
                        <div className='flex px-4 gap-1 flex-1 hover:brightness-90 cursor-pointer transition-all'>
                            {/* <img src={defaultOrImgSrc(appointment.Photo)} className={'rounded-full h-10 aspect-square'}
                            alt={'patient profile'} /> */}
                            <div className='w-1/4 px-4 py-2 bg-background-light rounded-xl h-full'>
                                <span className={`whitespace-nowrap overflow-hidden text-ellipsis pr-1`}>{appointment.Name}</span>
                            </div>
                            <div className='w-3/4 px-4 py-2 bg-background-light rounded-xl h-full'>
                                <span className={` whitespace-nowrap overflow-hidden text-ellipsis`}>{appointment.Title ? appointment.Title : 'No Title'}</span>
                            </div>
                            {appointment.Location === 'online' && (
                                <div className='w-3/4 px-4 py-2 bg-background-light rounded-xl h-full'>
                                    <span className={` whitespace-nowrap overflow-hidden text-ellipsis`}>{appointment.Code}</span>
                                </div>
                            )}
                        </div>

                    </NavLink>
                    <div className='h-6 w-6' onClick={() => handleAppointmentDelete(appointment)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#e41607" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM184 232l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z" /></svg>
                    </div>
                </div>
            })
            }
        </div>
    </TitledSection>
}