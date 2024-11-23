import {AiFillCaretDown, AiFillCaretUp, AiOutlineMore, AiOutlinePlus} from 'react-icons/ai';
import {useNavigate} from 'react-router-dom'
import {useState, useEffect, useRef} from 'react'
import {DialogNewPatient} from './dialogNewPatient/DialogNewPatient'
import {
    GetPatientsApiArg,
    Patient,
    useGetLatestOnlineVariableQuery,
    useGetActivePatientsQuery,
    useArchivePatientsByPatientIdMutation,
    useSkipPlannedPrescriptionMutation,
} from '../store/rehybApi'
import {Loader} from '../common/Loader'
import {SearchBox, searchPredicate} from '../common/SearchBox'
import {TinyDialog} from '../common/dialogs/TinyDialog'
import {defaultOrImgSrc} from "../common/utils";

export const Patients = () => {
    const [addPatientShowing, setAddPatientShowing] = useState<Patient | boolean>(false)
    const patientToEdit = (typeof addPatientShowing == 'boolean') ? undefined : addPatientShowing   //如果addPatientShowing是boolean，就是undefined，否则就是addPatientShowing
    //sorting是搜索参数，sortBy是排序的依据，asc是升序还是降序，assigned是是否已经分配
    const [sorting, setSorting] = useState<GetPatientsApiArg>({sortBy: 'Name', asc: true, assigned: true})
    const {data, error, isLoading, isFetching} = useGetActivePatientsQuery(sorting)
    const [search, setSearch] = useState('')        //搜索框的值

    const filteredPatients = (data ?? []).filter(patient => searchPredicate(search, patient.Name))

    const toggleSort = (sortType: typeof sorting.sortBy) => {       //点击排序按钮的时候，改变排序的依据,sortType是排序的依据,默认是Name
        setSorting({sortBy: sortType, asc: !sorting.asc, assigned: true})
    }
    //<SortByButton title={'Status'} onClick={toggleSort} sortType={'status'} sortState={sorting}/>
    //add this below if the status button has been added


    const calledOnce = useRef(false);
    //这个可以让useEffect只执行一次，即使在<React.StrictMode>模式下

    const [skipPlannedPrescription] = useSkipPlannedPrescriptionMutation();
    useEffect(() => {
        //切换到patient页面时，将planned的prescription变成skipped
        if (!calledOnce.current) {
            skipPlannedPrescription({});
            calledOnce.current = true;
        }
    }, [])

    return <>
        <div className='flex flex-col mx-10 my-6 gap-2'>
            <SearchBox searchValue={search} setSearchValue={setSearch}/>
            <div className='flex flex-row gap-3 mt-2'>
                <SortByButton title={'Name A-Z'} onClick={toggleSort} sortType={'Name'} sortState={sorting}/>
                {/*<SortByButton title={'Status'} onClick={toggleSort} sortType={'status'} sortState={sorting}/>*/}
                <div className='flex flex-1'/>
                <button className='btn-primary' onClick={() => setAddPatientShowing(true)}>
                    <AiOutlinePlus/>Add patient
                </button>
            </div>
            {/*//如果error为true，就显示Something failed*/}
            {error && <div>Something failed</div>}
            {/*//如果isLoading或者isFetching为true，就显示Loader*/}
            {(isLoading || isFetching) && <Loader style={{marginTop: '2em'}}/>}
            {!(isLoading || isFetching) && data &&
                <table className='table-auto border-separate border-spacing-y-2 w-full'>
                    <tbody>
                    {filteredPatients.length == 0 && <span>No patients found</span>}
                    {filteredPatients.map((patient) => <PatientRow
                        key={patient.PatientID} patient={patient}
                        editPatient={(patient) => setAddPatientShowing(patient)}/>)}
                    </tbody>
                </table>
            }
        </div>
        {addPatientShowing && <DialogNewPatient patientToEdit={patientToEdit} onDone={() => {
            setAddPatientShowing(false)
        }}/>}
    </>
}

const SortByButton = (props: {  //整个这个组件是排序按钮，点击的时候，调用toggleSort函数，传入sortType，将sorting这个state改变
    title: string,
    onClick: (type: GetPatientsApiArg['sortBy']) => void,   //传过来的是toggleSort函数
    sortState: GetPatientsApiArg,
    sortType: GetPatientsApiArg['sortBy']
}) => {
    const active = props.sortType == props.sortState.sortBy
    const activeCss = active ? 'border border-primary' : ''
    const caretAsc = (active && props.sortState.asc) ? 'brightness-100' : 'brightness-200';
    const caretDesc = (active && !props.sortState.asc) ? 'brightness-100' : 'brightness-200';

    return <button type='button'
                   className={`btn-tertiary px-5 py-2 ${activeCss}`}
                   onClick={() => props.onClick(props.sortType)}    //点击按钮的时候，调用toggleSort函数，传入sortType，将sorting这个state改变
    >
        {props.title}
        <div className='flex flex-col'>
            <AiFillCaretUp className={caretDesc}/>
            <AiFillCaretDown className={caretAsc}/>
        </div>
    </button>
}

// {props.title}
// <div className='flex flex-col'>
//     <AiFillCaretUp className={caretDesc}/>
//     <AiFillCaretDown className={caretAsc}/>
// </div>  是排序按钮的内容

const PatientRow = (props: { patient: Patient, editPatient: (patient: Patient) => void }) => {
    const navigate = useNavigate()
    const [showingActions, setShowingActions] = useState(false)

    const {data: lastTraining} = useGetLatestOnlineVariableQuery({PatientID: props.patient.PatientID});
    // console.log(lastTraining);
    const [archivePatient, {isLoading, isSuccess}] = useArchivePatientsByPatientIdMutation();

    let statusColor;
    let statusText;
    if (lastTraining) {
        if ("Message" in lastTraining) {
            statusColor = lastTraining.Message === "No data available" ? 'bg-black' : "bg-blue-500";
            statusText = lastTraining.Message === "No data available" ? `No session data available` : 'No exercise completed yet';
        } else {
            //返回的是自1970年1月1日午夜（UTC时间）以来的毫秒数
            const lastActivityDate = new Date(lastTraining.Date).getTime();
            const currentDate = new Date().getTime();
            const diffTime = Math.abs(currentDate - lastActivityDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); //毫秒数转换成天数
            if (diffDays < 3) {
                // Green for the first 3 days
                statusColor = 'bg-green-500';
                statusText = `Last completed session: ${diffDays} day(s) ago`; //Active within past 2 days
            } else if (diffDays >= 3 && diffDays <= 7) {
                // Yellow for 3 to 7 days
                statusColor = 'bg-yellow-500';
                statusText = `Last completed session: ${diffDays} day(s) ago`;//Active within past 7 days
            } else {
                // Red for more than 7 days
                statusColor = 'bg-red-500';
                statusText = `Last completed session: ${diffDays} day(s) ago`;//Not active for more than 7 days
            }
        }
    } else {
        statusColor = 'bg-black';
        statusText = `No session data available`;
    }


    if (isSuccess)
        return <></>

    if (isLoading)
        return <Loader/>
    // Beware of Firefox "I guess a bug". Setting border radius to <tr> does not seem to work
    //可能需要采取一些额外的步骤，比如给<tr>内的第一个和最后一个<td>或<th>元素分别设置圆角样式
    return <tr className='p-4 text-text bg-white hover:bg-tertiary transition-all cursor-pointer'
               onClick={() => navigate(props.patient.PatientID)}>
        <td className='rounded-l-2xl px-4 py-2 w-32'>
            <div className='relative w-fit'>
                {/*头像有的话显示头像，没有的话显示默认头像（老头）*/}
                <img src={defaultOrImgSrc(props.patient.Photo)} className='rounded-xl h-16 aspect-square object-contain'
                     alt={'patient profile'}/>
            </div>
        </td>
        <td className={'font-bold'}>{props.patient.Name}</td>
        <td>
            <div className='flex text-sm gap-2 items-center'>
                <div className={`rounded flex-shrink-0 border-2 border-primary w-4 h-4 ${statusColor}`}></div>
                {statusText}
            </div>
        </td>
        <td className={`whitespace-nowrap overflow-hidden text-ellipsis`}>{props.patient.PatientID}</td>
        <td className='rounded-r-2xl pr-4 text-right'>
            <div className={'h-10 w-10 hover:bg-tertiary rounded-full relative cursor-pointer'}
                 onClick={(e) => {
                     e.stopPropagation() //阻止事件冒泡到navigate(props.patient.PatientID)
                     setShowingActions(true)
                 }}
            >
                <AiOutlineMore className={'h-full w-full fill-primary'}/> {/*三点按钮,点一下出现Edit Patient页面*/}
                {showingActions && <TinyDialog onClose={() => setShowingActions(false)}>
                    <EditPatientDialog
                        onEdit={() => {
                            setShowingActions(false) //关闭小白色对话框
                            props.editPatient(props.patient)
                        }}
                        onArchive={() => {
                            setShowingActions(false)
                            archivePatient({
                                patientId: props.patient.PatientID
                            })
                        }}
                        // onDelete={() => {
                        //     setShowingActions(false)
                        //     deletePatient({
                        //         patientId: props.patient.PatientID
                        //     })
                        // }}
                    />
                </TinyDialog>}
            </div>

        </td>
    </tr>
}

const EditPatientDialog = (props: {
    onArchive: () => void,
    // onDelete: () => void,
    onEdit: () => void,
}) => {
    return <div className={'flex flex-col items-stretch gap-[1px] bg-secondary w-40'}>
        <div className={'btn-text bg-white cursor-pointer'} onClick={() => props.onEdit()}>Edit patient</div>
        <div className={'btn-text bg-white text-negative cursor-pointer'} onClick={() => props.onArchive()}>Archive
            patient
        </div>
        {/*<div className={'btn-text bg-white text-negative cursor-pointer'} onClick={() => props.onDelete()}>Delete patient</div>*/}
    </div>
}