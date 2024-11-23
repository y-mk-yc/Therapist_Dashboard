import {useParams} from 'react-router-dom'
import {
    ContactPerson, Patient,
    useGetPatientsByPatientIdQuery,
    useGetUsermodelByPatientIdQuery,
    useRemoveCaregiverFromActiveMutation,
} from '../../../store/rehybApi'
import {Loader} from '../../../common/Loader'
import {getAgeInYears, getDateString} from '../../../common/dateUtils'
import {AiOutlineEdit, AiOutlineMan, AiOutlinePlus, AiOutlineQuestion, AiOutlineWoman,AiOutlineClose} from 'react-icons/ai'
import {Completion} from './Completion'
import {TherapyGoals} from './TherapyGoals'
import {Mood} from './Mood'
import {useState} from 'react'
import {DialogAddContact} from './DialogAddContact'
import {CurrentCondition} from './CurrentCondition'
import {Notes} from "./Notes";
import {ActivityHistory} from "./ActivityHistory";
import {defaultOrImgSrc} from "../../../common/utils";
import {ExistingCaregiver} from "./ExistingCaregiver";
import { EditCaregiver } from './EditCaregiver'
import {SideDialog} from "../../../common/dialogs/SideDialog";
import {EditPatient} from "../../dialogNewPatient/EditPatient";

const InfoBox = (props: { title: string, value: string }) => { //左上角的信息框
    return <div className='flex flex-col gap-1'>
        <span className={'text-sm'}>{props.title}</span>
        <span className='font-semibold'>{props.value}</span>
    </div>
}

const Contact = (props: { patientId: string, contact: ContactPerson, onEdit: (showingEditCaregiver: false|string) => void }) => { //联系人,没头像数据就用默认老头头像

    const [remove, {isError}] = useRemoveCaregiverFromActiveMutation();
    const onRemove = async () => {
        await remove({PatientID: props.patientId, CaregiverID: props.contact.CaregiverID!})
    };
    if(isError) console.log("Error removing caregiver");

    return <div className='flex gap-4 p-2 items-center rounded-xl shadow'>
        <img src={defaultOrImgSrc(props.contact.Photo)} className='rounded-full h-10 aspect-square' alt={'Caregiver photo'}/>
        <div className='flex flex-col flex-1'>
            <span className={`text-text whitespace-nowrap overflow-hidden text-ellipsis`}>{props.contact.Name}</span>
            <span className='text-text-light text-sm whitespace-nowrap overflow-hidden text-ellipsis'>
                {props.contact.Gender === 'Male' &&
                    <AiOutlineMan className="p-1 rounded-full inline fill-primary bg-tertiary w-[18px] h-[18px] mr-1"/>}
                {props.contact.Gender === 'Female' &&
                    <AiOutlineWoman className="p-1 rounded-full inline fill-primary bg-tertiary w-[18px] h-[18px] mr-1"/>}
                {props.contact.Gender === 'Other' &&
                    <AiOutlineQuestion className="p-1 rounded-full inline fill-primary bg-tertiary w-[18px] h-[18px] mr-1"/>}
                {props.contact.Email}
            </span>
        </div>
        <div className='flex gap-1'>
        <AiOutlineEdit onClick={() => props.onEdit(props.contact.Email)}
                       className='btn-icon w-6 h-6 cursor-pointer bg-primary hover:bg-secondary2'
        />
        <AiOutlineClose onClick={onRemove}
                        className='btn-icon w-6 h-6 cursor-pointer bg-primary hover:bg-secondary2'

        />
        </div>
    </div>
}

export const Overview = () => {
    const [showingAddContact, setShowingAddContact] = useState(false)
    const [showingExistingCaregivers, setShowingExistingCaregivers] = useState(false)
    const [showingEditCaregiver, setShowingEditCaregiver] = useState<false|string>(false)
    const {patientId} = useParams() //获取当前路径的参数，即PatientID
    const {data, isLoading, isError} = useGetPatientsByPatientIdQuery({PatientID: patientId!}) //感叹号表示确定一定不为空
    const [showEditPatient, setShowEditPatient] = useState(false)

    const {
        data: userModelData,
        isLoading: isLoadingUserModel,
        isError: isUserModelError,
    } = useGetUsermodelByPatientIdQuery({PatientID: patientId!});

    if (isLoading || isLoadingUserModel) return <div className={'flex w-full justify-center'}><Loader/></div>;
    if (isError || isUserModelError) return <p>Something went wrong</p>
    if (!data || !userModelData) return <p>No data</p>

    return <div className='flex flex-wrap gap-6 w-full p-6'>
        <div className='flex flex-col flex-wrap gap-4 flex-[2]'>
            <div className='card relative'>
                <AiOutlineEdit onClick={() => setShowEditPatient(true)}
                               className='absolute right-3 top-3 btn-icon w-6 h-6 cursor-pointer bg-primary hover:bg-secondary2'
                />
                <h3>Patient info</h3>
                <div className='flex gap-3 mt-2'>
                    <img src={defaultOrImgSrc(data.Photo)} className='rounded-full flex-none h-16 aspect-square' alt={'Patient photo'}/>
                    <div className={`flex-1 flex flex-col justify-around`}>
                        <span className={`flex justify-center font-itcedscr text-4xl`}>{data.Name}</span>
                        <div className={`flex justify-around`}>
                            {userModelData?.Gender === 'Male' &&
                                <AiOutlineMan
                                    className="inline fill-primary w-[20px] h-[20px]"/>}
                            {userModelData?.Gender === 'Female' &&
                                <AiOutlineWoman
                                    className="inline fill-primary w-[20px] h-[20px]"/>}
                            {userModelData?.Gender === 'Other' &&
                                <AiOutlineQuestion
                                    className="inline fill-primary  w-[20px] h-[20px]"/>}
                            <span>{userModelData.Weight ?? 'unknown'} Kg</span>
                            <span>{userModelData.Age ?? getAgeInYears(new Date(userModelData.Birthday))} Yrs</span>
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-2 mt-4'>
                    {([
                        {title: 'Type of stroke', value: userModelData?.TypeOfStroke},
                        {
                            title: 'Date of incidence',
                            value: userModelData?.TimeOfStroke ? getDateString(new Date(userModelData.TimeOfStroke)) : 'Unknown'
                        },
                        {title: 'Dominant arm', value: userModelData?.DominantSide},
                        {title: 'Affected arm', value: userModelData?.PareticSide},
                        {
                            title: 'Corrected Vision',
                            value: `Left: ${userModelData?.CorrectedVision?.Left}, Right: ${userModelData?.CorrectedVision?.Right}`
                        },
                        {
                            title: 'Personal Interests',
                            value: Object.entries(userModelData?.Interests || {}).filter(([key, value]) => value).map(([key]) => key).join(", ")
                        },
                        {title: 'Default ReHyb Setup', value: userModelData?.DefaultReHybSetup},

                    ] as { title: string, value: string }[]).map(info =>
                        <InfoBox
                            key={info.title + info.value}
                            title={info.title}
                            value={info.value}/>)}
                </div>
            </div>
            <div className='card'>
                <h3>Contact people</h3>
                <div className='flex flex-col'>
                    {!userModelData?.Contacts && <>Server has not implemented the API.</>}
                    {userModelData?.Contacts && userModelData?.Contacts.map((contact) =>
                        <Contact key={contact.CaregiverID} patientId={patientId!} contact={contact} onEdit={setShowingEditCaregiver}/>)}
                    <button
                        className='btn-secondary mt-4 self-start mx-auto'
                        onClick={() => {
                            setShowingExistingCaregivers(true)
                        }}
                    ><AiOutlinePlus/>Add new
                    </button>
                </div>
            </div>
        </div>
        <div className='flex flex-col gap-4 flex-[5] min-w-[390px]'>
            <div className='card'>
                {/*Exercise Completion Rate*/}
                <Completion/>
            </div>
            <div className='card'>
                {/*Patient current condition*/}
                {<CurrentCondition/>}
            </div>
            <div className='flex gap-4 flex-wrap'>
                <div className='card flex flex-col flex-[2]'>
                    {/*Therapy goals*/}
                    <TherapyGoals/>
                </div>
                <div className='card flex flex-col flex-1'>
                    {/*Patient mood*/}
                    <Mood/>
                </div>
            </div>
            <div className='card'>
                <h3>Activity time</h3>
                <ActivityHistory/>
                {/*这个活动时间将所有的exercise的session画在一个svg上,由于处于覆盖状态，加上单个的矩形有透明度，所以颜色会叠加，颜色越深表示活动时间越多*/}
                {/*最后得出哪个时间段是最活跃的*/}
            </div>
            <Notes/>
        </div>
        {showingExistingCaregivers &&
            <ExistingCaregiver
                goToCreateNewCaregiver={() => {
                    setShowingExistingCaregivers(false);
                    setShowingAddContact(true);
                }}
                cancel={() => setShowingExistingCaregivers(false)}
            />
        }
        {showingAddContact && <DialogAddContact onDone={() => setShowingAddContact(false)}/>}
        {!!showingEditCaregiver && <EditCaregiver caregiverToEditEmail={showingEditCaregiver} cancel={() => setShowingEditCaregiver(false)}/>}
        {showEditPatient &&
            <SideDialog
                title={`Edit Patient`}
                subtitle={`Edit patient's information.`}
                onClose={()=>setShowEditPatient(false)}
                primaryAction={undefined}
                showCancelButton={false}
            >
                <EditPatient patientToEdit={data} cancel={()=>setShowEditPatient(false)}/>
            </SideDialog>
        }
    </div>
}
