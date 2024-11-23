import {SearchBox, searchPredicate} from "../../common/SearchBox";
import {Patient, useGetInactivePatientsQuery, useAddPatientIntoActiveMutation} from "../../store/rehybApi";
import {Loader} from "../../common/Loader";
import {useState} from "react";
import {defaultOrImgSrc} from "../../common/utils";

export const ExistingPatient = (props: {
    goToCreateNewPatient: () => void,
    cancel: () => void
}) => {
    const {data, isLoading, isError, isFetching} = useGetInactivePatientsQuery({
        assigned: false,
        sortBy: 'status',
        asc: true
    })
    const [searchValue, setSearchValue] = useState('')
    const filteredPatients = (data ?? []).filter(patient => searchPredicate(searchValue, patient.Name))

    return <>
        <div className={'flex flex-col gap-4 flex-1 w-[510px]'}>
            {(isLoading || isFetching) && <Loader/>}
            {isError &&
                <div className={'flex flex-col gap-2 overflow-y-scroll card-outline h-[350px] '}>
                    <span>Failed loading patients</span>
                </div>}
            {!(isLoading || isFetching) && data &&
                <div className={'flex flex-col gap-2 overflow-y-scroll card-outline h-[350px] '}>
                    {filteredPatients.length == 0 && <span>No patients found</span>}
                    {filteredPatients.map((patient) => <ExistingPatientRow patient={patient}/>)}
                </div>
            }
            <SearchBox searchValue={searchValue} setSearchValue={setSearchValue}/>
            <hr/>
            {/*分割线*/}
            <div className={'flex items-center justify-between'}>
                <h4 className={''}>A new patient?</h4>
                <button className={'btn-primary self-center p-3'} onClick={props.goToCreateNewPatient}>Create new
                    patient
                </button>
            </div>
            <div className={'flex-1'}/>
            <button className='btn-secondary self-end' onClick={props.cancel}>Cancel</button>
        </div>
    </>
}

const ExistingPatientRow = (props: { patient: Patient }) => {
    const [addPatientIntoActiveMutation] = useAddPatientIntoActiveMutation()
    const onAdd = async () => {
        const result = await addPatientIntoActiveMutation({
            PatientID: props.patient.PatientID
        })
        if ('error' in result) {
            console.error('add patient failed', result.error)
            return
        }
    }
    return <div className={'flex bg-tertiary rounded-xl p-2 gap-4 items-center'}>
        <img src={defaultOrImgSrc(props.patient.Photo)} className={'h-16'} alt={'patient profile'}/>
        <span className={'font-bold whitespace-nowrap'}>{props.patient.Name}</span>
        <span className={'whitespace-nowrap overflow-hidden text-ellipsis'}>{props.patient.PatientID}</span>
        <div className={'flex-1'}/>
        <button className={'btn-primary'} onClick={onAdd}>Add</button>
    </div>
}