import {SearchBox, searchPredicate} from "../../../common/SearchBox";
import {SideDialog} from '../../../common/dialogs/SideDialog'
import {ContactPerson, useGetInactiveCaregiversQuery, useAddCaregiverIntoActiveMutation} from "../../../store/rehybApi";
import {Loader} from "../../../common/Loader";
import {useState} from "react";
import {defaultOrImgSrc} from "../../../common/utils";
import {useParams} from 'react-router-dom'

export const ExistingCaregiver = (props: {
    goToCreateNewCaregiver: () => void,
    cancel: () => void
}) => {
    const {patientId} = useParams();
    const {data, isLoading, isError, isFetching} = useGetInactiveCaregiversQuery({
        PatientID: patientId!,
        sortBy: 'Name'
    })
    const [searchValue, setSearchValue] = useState('')
    const filteredCaregivers = (data ?? []).filter(caregiver => searchPredicate(searchValue, caregiver.Name))

    return <SideDialog
        title={`Add contact people`}
        subtitle={'Find an existing caregiver in the list.'}
        onClose={props.cancel}
        primaryAction={undefined}
        showCancelButton={false}
    >
        <div className={'flex flex-col gap-4 flex-1 w-[510px]'}>
            {(isLoading || isFetching) && <Loader/>}
            {isError &&
                <div className={'flex flex-col gap-2 overflow-y-scroll card-outline h-[350px] '}>
                    <span>Failed loading caregivers</span>
                </div>}
            {!(isLoading || isFetching) && data &&
                <div className={'flex flex-col gap-2 overflow-y-scroll card-outline h-[350px] '}>
                    {filteredCaregivers.length == 0 && <span>No caregivers found</span>}
                    {filteredCaregivers.map((caregiver) => <ExistingCaregiverRow caregiver={caregiver} patientID={patientId!}/>)}
                </div>
            }
            <SearchBox searchValue={searchValue} setSearchValue={setSearchValue}/>
            <hr/>
            {/*分割线*/}
            <div className={'flex items-center justify-between'}>
                <h4 className={''}>A new caregiver?</h4>
                <button className={'btn-primary self-center p-3'} onClick={props.goToCreateNewCaregiver}>Create new
                    caregiver
                </button>
            </div>
            <div className={'flex-1'}/>
            <button className='btn-secondary self-end' onClick={props.cancel}>Cancel</button>
        </div>
    </SideDialog>
}

const ExistingCaregiverRow = (props: { caregiver: ContactPerson,patientID:string }) => {
    const [addCaregiverIntoActiveMutation] = useAddCaregiverIntoActiveMutation()
    const onAdd = async () => {
        const result = await addCaregiverIntoActiveMutation({
            PatientID: props.patientID,
            CaregiverID: props.caregiver.CaregiverID!
        })
        if ('error' in result) {
            console.error('add caregiver failed', result.error)
            return
        }
    }
    return <div className={'flex bg-tertiary rounded-xl p-2 gap-4 items-center'}>
        <img src={defaultOrImgSrc(props.caregiver.Photo)} className={'h-16'} alt={'caregiver profile'}/>
        <span className={'font-bold whitespace-nowrap'}>{props.caregiver.Name}</span>
        <span className={`whitespace-nowrap overflow-hidden text-ellipsis`}>{props.caregiver.CaregiverID}</span>
        <div className={'flex-1'}/>
        <button className={'btn-primary'} onClick={onAdd}>Add</button>
    </div>
}