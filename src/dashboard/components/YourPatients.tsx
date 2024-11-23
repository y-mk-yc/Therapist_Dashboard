import React, {FC} from "react";
import {AiOutlineUser} from "react-icons/ai";
import {TitledSection} from "./TitledSections";
import {GetActivityStatusResponse} from "../../store/rehybApi";


export const YourPatients: FC<{ data: GetActivityStatusResponse }> = ({data}) => {
    return <TitledSection title={'Your Patients'}>
        <div className='flex card justify-between p-0'>
            <PatientCount count={data.Online} label={'Online'} iconClassName={'bg-primary'}/>
            <PatientCount count={data.Exercising} label={'Exercising'} iconClassName={'bg-positive'}/>
            <PatientCount count={data.Offline} label={'Offline'} iconClassName={'bg-secondary'}/>
        </div>
    </TitledSection>
}

const PatientCount: FC<{ count: number, label: string, iconClassName: string }> = ({count, iconClassName, label}) => {
    return <div
        className={'flex flex-1 flex-col py-6 [&>span]:text-primary items-center'}>
        <div className={`rounded-full ${iconClassName} mb-2 p-1`}>
            <AiOutlineUser className='w-8 h-8 fill-white'/>
        </div>
        <span className={'font-bold'}>{count}</span>
        <span>{label}</span>
    </div>
}