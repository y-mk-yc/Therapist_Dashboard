import {Loader} from "../../common/Loader";
import {isCalendar} from "../CalendarHelper";
import {getDateString, isDateToday, parseDateOrToday, shortTime} from "../../common/dateUtils";
import guy from "../old-guy.png";
import {TitledSection} from "./TitledSections";
import React from "react";
import {
    useGetOverviewQuery,
    useGetAppointmentsByTherapistIdAndDateQuery,
    InlineResponse2004,
    InlineResponse2004PatientActivities
} from "../../store/rehybApi";
import {defaultOrImgSrc} from "../../common/utils";
import {NavLink} from "react-router-dom";

export const PatientsAtDate = (props: { selectedDate: Date }) => { //显示一个日期的appointments
    // const {data} = useGetOverviewQuery()
    //useGetOverviewQuery需要根据当前的日期来获取数据，所以需要传递一个参数
    ////////////////////////////mock data////////////////////////

    // const data: InlineResponse2004 = {
    //     patientsExercising: 1,
    //     patientsOnline: 1,
    //     patientsOffline: 1,
    //     patientActivities: [{
    //         exercise: {
    //             SessionID: "dasadssdasdada",
    //             from: "2024-3-5",
    //             to: "2024-3-10",
    //             id: "11111",
    //             name: "nihao",
    //             status: "Finished"
    //         },
    //         patient: {
    //             id: "11111",
    //             imgUrl: "https://img.freepik.com/free-photo/isolated-happy-smiling-dog-white-background-portrait-4_1562-693.jpg",
    //             name: "dadas"
    //         }
    //     },
    //         {
    //             exercise: {
    //                 SessionID: "dasadssdasdada",
    //                 from: "2024-3-5",
    //                 to: "2024-3-10",
    //                 id: "11111",
    //                 name: "nihao",
    //                 status: "Finished"
    //             },
    //             patient: {
    //                 id: "11111",
    //                 imgUrl: "https://img.freepik.com/free-photo/isolated-happy-smiling-dog-white-background-portrait-4_1562-693.jpg",
    //                 name: "dadas"
    //             }
    //         },
    //         {
    //             exercise: {
    //                 SessionID: "dasadssdasdada",
    //                 from: "2024-3-5",
    //                 to: "2024-3-10",
    //                 id: "11111",
    //                 name: "nihao",
    //                 status: "Finished"
    //             },
    //             patient: {
    //                 id: "11111",
    //                 imgUrl: "https://img.freepik.com/free-photo/isolated-happy-smiling-dog-white-background-portrait-4_1562-693.jpg",
    //                 name: "dadas"
    //             }
    //         },
    //         {
    //             exercise: {
    //                 SessionID: "dasadssdasdada",
    //                 from: "2024-3-5",
    //                 to: "2024-3-10",
    //                 id: "11111",
    //                 name: "nihao",
    //                 status: "Finished"
    //             },
    //             patient: {
    //                 id: "11111",
    //                 imgUrl: "https://img.freepik.com/free-photo/isolated-happy-smiling-dog-white-background-portrait-4_1562-693.jpg",
    //                 name: "dadas"
    //             }
    //         },
    //         {
    //             exercise: {
    //                 SessionID: "dasadssdasdada",
    //                 from: "2024-3-5",
    //                 to: "2024-3-10",
    //                 id: "11111",
    //                 name: "nihao",
    //                 status: "Finished"
    //             },
    //             patient: {
    //                 id: "11111",
    //                 imgUrl: "https://img.freepik.com/free-photo/isolated-happy-smiling-dog-white-background-portrait-4_1562-693.jpg",
    //                 name: "dadas"
    //             }
    //         },
    //         {
    //             exercise: {
    //                 SessionID: "dasadssdasdada",
    //                 from: "2024-3-5",
    //                 to: "2024-3-10",
    //                 id: "11111",
    //                 name: "nihao",
    //                 status: "Finished"
    //             },
    //             patient: {
    //                 id: "11111",
    //                 imgUrl: "https://img.freepik.com/free-photo/isolated-happy-smiling-dog-white-background-portrait-4_1562-693.jpg",
    //                 name: "dadas"
    //             }
    //         }
    //     ],
    //     calendar: ""
    // };
    ////////////////////////////mock data////////////////////////
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

    const {
        data,
        isLoading,
        isError
    } = useGetAppointmentsByTherapistIdAndDateQuery({StartDate: props.selectedDate.toISOString()}) //根据当前的日期来获取数据


    const title = isDateToday(props.selectedDate) ?
        'Patients Today' : `Patients on ${getDateString(props.selectedDate)}`

    return <TitledSection title={title}>
        <div className='card flex flex-col gap-2 overflow-auto max-h-[200px] min-w-[300px]'>
            {isLoading && <Loader/>}
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
            {!(isLoading || isError) && data && data.length > 0 && data.map(appointment => {
                        const date = `${shortTime(new Date(appointment.StartTime))} - ${shortTime(new Date(appointment.EndTime))}`; //获得一个appointment的开始时间到结束时间
                    // const date = `${shortTime(new Date(appointment.StartTime))} - ${shortTime(parseDateOrToday(event.exercise.to))}`; //获得一个exercise的开始时间到结束时间

                        return <NavLink to={`patients/${appointment.PatientID}`}
                                        className={'flex items-center gap-x-3 gap-y-0.5 flex-wrap'} key={appointment.PatientID}>
                            <span>{date}</span>
                            <div
                                className='flex bg-background-light rounded-xl py-2 px-4 gap-4 flex-1 hover:brightness-90 cursor-pointer transition-all'>
                                <img src={defaultOrImgSrc(appointment.Photo)} className={'rounded-full h-10 aspect-square'}
                                     alt={'patient profile'}/>
                                <div className='flex flex-col'>
                                    <span className={`whitespace-nowrap overflow-hidden text-ellipsis`}>{appointment.Name}</span>
                                </div>
                            </div>
                        </NavLink>
                    })
            }
        </div>
    </TitledSection>
}