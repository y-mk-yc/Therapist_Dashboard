import {TitledSection} from "./TitledSections";
import React, {FC, ReactNode} from "react";
import {GetOverviewApiResponse, InlineResponse2004} from "../../store/rehybApi";
import {defaultOrImgSrc} from "../../common/utils";
import {NavLink} from "react-router-dom";

export const PatientsActivities: FC<{ data: GetOverviewApiResponse }> = ({data}) => {
    // const now = new Date();
    //TODO:
    //根据now的值和data.patientActivities.exercise.from和to的值，来判断患者是否正在进行锻炼
    //以及根据data.patientActivities.exercise.status的值来判断患者是否已经完成锻炼
    //所以activity={}部分之后可能要修改
    return <TitledSection title={'Patient activities'}>
        <div className='card flex flex-col gap-2'>
            {data.patientActivities.map(patientActivity => <PatientExerciseRow
                userId={patientActivity.patient.id}
                img={defaultOrImgSrc(patientActivity.patient.imgUrl)}
                key={patientActivity.exercise.SessionID}
                name={patientActivity.patient.name}
                activity={
                    patientActivity.exercise.status == 'Finished' ?
                        <>Finished <span className={'text-positive'}>{patientActivity.exercise.name}</span>.</> :
                        patientActivity.exercise.status == 'Unfinished'?
                            <>Aborted <span className={'text-middle'}>{patientActivity.exercise.name}</span>.</>:
                            <>Skipped <span className={'text-negative'}>{patientActivity.exercise.name}</span>.</>
                }
            />)}
        </div>
    </TitledSection>
}

const PatientExerciseRow = (props: { userId: string, img: string, name: string, activity: ReactNode }) => {
    return <NavLink to={`patients/${props.userId}`}
        className='flex bg-background-light rounded-xl py-2 px-4 gap-4 hover:brightness-90 cursor-pointer transition-all'>
        <img className='rounded-full h-10 aspect-square' src={props.img} alt={'patient profile'}/>
        <div className='flex flex-col'>
            <span className=''>{props.name}</span>
            <span className='text-gray-400 [&>a]:text-orange-300'>{props.activity}</span>
            {/*为当前元素设置文本颜色为中等深浅的灰色，并且将其直接子元素中的所有<a>标签的文本颜色设置为较浅的橙色。*/}
        </div>
    </NavLink>
}


///////////mock data///////////
// const data1: InlineResponse2004 = {
//     patientsExercising: 1,
//     patientsOnline: 1,
//     patientsOffline: 1,
//     patientActivities: [{
//         exercise: {
//             SessionID: "dasadssdasdada",
//             from: "2024-3-5",
//             to: "2024-3-10",
//             // id: "11111",
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
//                 // id: "11111",
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
//                 // id: "11111",
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
//                 // id: "11111",
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
//                 // id: "11111",
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
//                 // id: "11111",
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

//////////////////////////////