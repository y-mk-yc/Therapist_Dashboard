import
{
    AiOutlineLeft,
    AiOutlineRight
} from 'react-icons/ai'
import { areDatesSame, getDateString, getWeekDayName, getWeekDays } from '../../../common/dateUtils'
import React, { useEffect, useState } from 'react'
import
{
    Exercise,
    OnlineVariableSession,
    useGetAllExerciseProtocolsQuery,
    Prescription,
    useGetPrescriptionsAndExerciseSessionsByPatientIdQuery,
    EditablePrescription, useUpdateExercisePlanMutation,
    useGetDefaultRehybSetupAndFreeToPlayProtocolsQuery,
    useUpdateFreeToPlayProtocolsByPatientIdMutation
} from '../../../store/rehybApi'
import { Loader } from '../../../common/Loader'
import { DialogPlanExercise } from "./DialogPlanExercise";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { EXERCISE_STATE_COLORS } from "../../../common/ExerciseColors";
import { FaCircle } from "react-icons/fa";
import { ExerciseList } from "./ExerciseList";
import { BsFileEarmarkCheck } from "react-icons/bs";
import { IoRemoveCircle } from "react-icons/io5";
import { v4 as uuidv4 } from 'uuid';

import { DialogCloseOnly } from '../../../common/dialogs/DialogCloseOnly'
import { DetailAndLabeling } from './DetailAndLabeling/DetailAndLabeling'

export function isPrescription(exercise: Prescription | OnlineVariableSession | EditablePrescription): exercise is Prescription
{
    return (exercise as Prescription).Date !== undefined && (exercise as EditablePrescription).Editable === undefined;
}

export function isEditablePrescription(exercise: Prescription | OnlineVariableSession | EditablePrescription): exercise is EditablePrescription
{
    return (exercise as EditablePrescription).Editable !== undefined;
}

export const PatientExercises = () =>
{
    const [currentWeekDay, setWeekDay] = useState(new Date()) //设为当前日期
    const [recommended, setRecommended] = useState(true) //要不要显示推荐的exercise

    const [pendingToDelete, setPendingToDelete] = useState<string[]>([]) //要删除的pending exercise的ID

    const [clickCancel, setClickCancel] = useState(false) //点击cancel按钮的状态
    const [showingPlanExerciseDialog, setShowingPlanExerciseDialog] =
        useState<null | { day: Date, prescriptionID: string, reeditPrescription?: EditablePrescription }>(null)

    const weekDays = getWeekDays(currentWeekDay)//获得当前日期所在的星期的所有日期，从星期一开始，到星期日结束

    const currentWeek = `${getDateString(weekDays[0])} - ${getDateString(weekDays[6])}`  //字符串，例如"08/04/2024 - 14/04/2024"

    const [exercisesAndPrescriptions, setExercisesAndPrescriptions] = useState<Record<string, (OnlineVariableSession | Prescription | EditablePrescription)[]>>(() =>
    {
        const dayKey: Record<string, (OnlineVariableSession | Prescription | EditablePrescription)[]> = {}
        weekDays.forEach(day =>
        {
            dayKey[getDateString(day)] = [] //当地时间的日期字符串为键，值为OnlineVariableSession类型空数组
        })
        return dayKey;
    })

    // console.log(exercisesAndPrescriptions);

    const { patientId } = useParams();

    const { data: defaultRehybSetupAndFreeToPlayProtocols } = useGetDefaultRehybSetupAndFreeToPlayProtocolsQuery({ PatientID: patientId! });
    const freeToPlayProtocolIDs = defaultRehybSetupAndFreeToPlayProtocols?.FreeToPlayProtocolIDs;
    const defaultRehybSetup = defaultRehybSetupAndFreeToPlayProtocols?.DefaultReHybSetup;

    const [freeToPlayProtocols, setFreeToPlayProtocols] = useState<{ initial: string[], updated: string[] }>
        ({ initial: [], updated: [] });

    const { data, isLoading, isFetching } = useGetPrescriptionsAndExerciseSessionsByPatientIdQuery(
        {
            PatientID: patientId!,
            TimeSpan: { StartDate: new Date(weekDays[0]).toISOString(), EndDate: new Date(weekDays[6]).toISOString() }
        }
    ) //这里的data是一个数组，数组中的元素是PatientID的所有的exerciseSession
    // console.log(data);

    useEffect(() =>
    {
        if (freeToPlayProtocolIDs)
        {
            setFreeToPlayProtocols({ initial: freeToPlayProtocolIDs, updated: freeToPlayProtocolIDs })
        }

        if (!data) return //从后端获得的data只有可能为OnlineVariableSession或者Prescription类型，不可能为EditablePrescription类型
        const exercisesAndPrescriptionsTemp: Record<string, (OnlineVariableSession | Prescription | EditablePrescription)[]> = {}
        weekDays.forEach(day =>
        {
            exercisesAndPrescriptionsTemp[getDateString(day)] = data.filter(exercise =>
            {
                if (isPrescription(exercise))
                {
                    return areDatesSame(new Date(exercise.Date), day);
                } else
                {
                    return areDatesSame(new Date(exercise.Data.CommonEvents.ProtocolStart), day)
                }
            })
        })
        setExercisesAndPrescriptions(exercisesAndPrescriptionsTemp);
        setPendingToDelete([]); //清空pendingToDelete
    }, [currentWeek, data, clickCancel, freeToPlayProtocolIDs]) //currentWeek和data不变，exercisesAndPrescriptions也不变


    const [currentlyDragged, setCurrentlyDragged] = useState<null | Exercise>(null) //现在拖动的是哪个exercise


    const onDragOver = (e: React.DragEvent<HTMLDivElement>, day: Date) =>
    {
        if (dayjs(day).isBefore(dayjs(new Date()), 'day')) return; //如果day是今天之前的日期，就不允许drag over,即后续不允许drop

        e.preventDefault();
    }
    const onDrop = async (e: React.DragEvent, day: Date) =>
    {
        e.preventDefault();
        if (currentlyDragged == null) return;
        const prescriptionID = `PRE-${uuidv4()}`;


        const newPrescriptions: EditablePrescription[] = [];
        for (const day in exercisesAndPrescriptions)
        {
            newPrescriptions.push(...exercisesAndPrescriptions[day].filter(isEditablePrescription));
        }
        console.log({ newPrescriptions })
        await updateExercisePlan({
            PatientID: patientId!,
            PendingToDelete: pendingToDelete,
            EditablePrescriptions: newPrescriptions,
        });

        setExercisesAndPrescriptions((prevState) =>
        {
            //给exercisesAndPrescriptions的day那一天的数组添加一个新的EditablePrescription类型的元素
            return {
                ...prevState,
                [getDateString(day)]: [...exercisesAndPrescriptions[getDateString(day)], {
                    PrescriptionID: prescriptionID,
                    Date: dayjs(day).startOf('day').toISOString(),
                    PatientID: patientId!,
                    ProtocolID: currentlyDragged.ProtocolID,
                    Editable: true,

                } as unknown as EditablePrescription]
            }
        })
        setShowingPlanExerciseDialog({ day, prescriptionID });
        setCurrentlyDragged(null);
    }

    const changeWeek = (forward: boolean) =>
    {
        //根据forward的值，前进一周或者后退一周，current的值是别的周的同一天
        const current = new Date(currentWeekDay)
        current.setDate(current.getDate() + (forward ? 7 : -7));
        setWeekDay(current)
    }

    const goToToday = () =>
    { //回到今天
        setWeekDay(new Date())
    }
    const deleteIsEditablePrescription = (prescriptionID: string, day: Date) =>
    {
        setExercisesAndPrescriptions((prevState) =>
        {
            const dateString = getDateString(day);
            return {
                ...prevState,
                [dateString]: prevState[dateString].filter((item) =>
                    (item as Prescription | EditablePrescription).PrescriptionID !== prescriptionID
                )
            }
        })
    }

    const deletePrescription = (prescriptionID: string, day: Date) =>
    {
        setExercisesAndPrescriptions((prevState) =>
        {
            const dateString = getDateString(day);
            return {
                ...prevState,
                [dateString]: prevState[dateString].filter((item) =>
                    (item as Prescription | EditablePrescription).PrescriptionID !== prescriptionID
                )
            }
        })


    }
    const addPendingToDelete = async (prescriptionID: string) =>
    {
        setPendingToDelete((prevState) => [...prevState, prescriptionID])


        const rt = await updateExercisePlan({
            PatientID: patientId!,
            PendingToDelete: [prescriptionID],
            EditablePrescriptions: [],
        });
        console.log(rt)
    }

    const doEditablePrescriptionsExist = () =>
    {
        for (const day in exercisesAndPrescriptions)
        {
            if (exercisesAndPrescriptions[day].find(isEditablePrescription)) return true;
        }
        return false;
    }

    //下面还包括freeToPlayProtocols.updated与freeToPlayProtocols.initial的比较，看是否有改变
    const hasFreeToPlayProtocolsChanged = freeToPlayProtocols.updated.length !== freeToPlayProtocols.initial.length ||
        freeToPlayProtocols.updated.some(protocolID => !freeToPlayProtocols.initial.includes(protocolID));
    const hasPrescriptionsChanged = doEditablePrescriptionsExist() || pendingToDelete.length > 0;


    const [updateExercisePlan] = useUpdateExercisePlanMutation();
    // console.log("doEditablePrescriptionsExist: ", doEditablePrescriptionsExist());
    // console.log(exercisesAndPrescriptions);
    // console.log(pendingToDelete);
    const [updateFreeToPlayProtocols] = useUpdateFreeToPlayProtocolsByPatientIdMutation();

    const onSave = async () =>
    {
        try
        {
            if (hasFreeToPlayProtocolsChanged)
            {
                await updateFreeToPlayProtocols({
                    PatientID: patientId!,
                    FreeToPlayProtocolIDs: freeToPlayProtocols.updated
                });
            }
            if (hasPrescriptionsChanged)
            {
                const newPrescriptions: EditablePrescription[] = [];
                for (const day in exercisesAndPrescriptions)
                {
                    newPrescriptions.push(...exercisesAndPrescriptions[day].filter(isEditablePrescription));
                }
                await updateExercisePlan({
                    PatientID: patientId!,
                    PendingToDelete: pendingToDelete,
                    EditablePrescriptions: newPrescriptions,
                });
            }
        } catch (e)
        {
            console.error(e);
        }
    };

    return <div className='flex flex-wrap w-full gap-4 p-4 @container' onDragOver={(e) =>
    {
        const mouseY = e.clientY;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        if (mouseY <= viewportHeight / 4)
        {
            window.scrollBy(0, -20);
        }
        if (mouseY >= viewportHeight * 3 / 4)
        {
            window.scrollBy(0, 20);
        }
        e.stopPropagation();
    }}>
        <div className='card flex-[3] flex-col p-0'> {/*左边的Exercise schedule的一整块 */}

            <div className='flex justify-between items-center px-6 py-4 gap-6'>
                <div className='flex flex-col'>
                    <div className='flex gap-4 items-center'>
                        <h3>Exercise schedule</h3>
                        <div className={'flex flex-wrap gap-2 items-center justify-center'}>
                            <span className='shadow px-3 py-1 rounded-xl'>{currentWeek}</span>
                            <div className={'flex gap-1'}>
                                <button
                                    className='btn-tertiary inline-flex p-2'
                                    onClick={() => changeWeek(false)}
                                ><AiOutlineLeft /></button>
                                <button className='btn-primary inline-flex p-2' onClick={goToToday}>
                                    Today
                                </button>
                                <button
                                    className='btn-tertiary inline-flex p-2'
                                    onClick={() => changeWeek(true)}
                                ><AiOutlineRight /></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex gap-2'>
                    <button className={`btn-secondary`}
                        onClick={() => setClickCancel(!clickCancel)}
                    //点击cancel按钮，clickCancel的值取反，这样就会重新加载数据,因为clickCancel是useEffect的依赖,注意要清空pendingToDelete
                    >Reset
                    </button>
                    {/* <button className={`btn-primary px-4`}
                        disabled={!(hasPrescriptionsChanged || hasFreeToPlayProtocolsChanged)} //如果isSaveEnabled为false，就不能点击
                        onClick={onSave}
                    ><BsFileEarmarkCheck />Save
                    </button> */}
                </div>

            </div>

            <div className={`flex justify-around gap-4 my-4`}>
                <span className={`font-semibold`}><FaCircle className={`fill-positive inline`} /> Finished</span>
                <span className={`font-semibold`}><FaCircle className={`fill-middle inline`} /> Unfinished</span>
                <span className={`font-semibold`}><FaCircle className={`fill-negative inline`} /> Skipped</span>
                <span className={`font-semibold`}><FaCircle className={`fill-primary inline`} /> Pending</span>
                <span className={`font-semibold`}><FaCircle className={`fill-gray-600 inline`} /> Editable</span>
            </div>

            {(isLoading || isFetching) && <div className={'flex justify-center mt-8'}><Loader /></div>}
            <div className='grid grid-cols-[0fr_10fr]'>
                {/*第一列的宽度为0,即第一列不占用剩余空间;第二列的宽度为10,即第二列占用剩余空间的10/10,也就是全部剩余空间。*/}
                {/*这样设置的效果是,第一列的宽度会尽可能小(由其内容决定),而第二列会占据所有剩余的宽度*/}
                {!isLoading && !isFetching && data && <>
                    {weekDays.map((day, idx) =>
                        <div
                            key={day.toString()} //这里的key是weekDays中的日期字符串
                            className='pt-2 bg-white px-5 border-r
                        first:border-t shadow-lg z-0 '
                            style={{
                                gridRowStart: idx + 1, //第idx个元素放在第idx+1行
                                borderTopRightRadius: idx == 0 ? '10px' : '0px', //第一个元素的右上角是圆角的，其他的不是
                                borderBottomRightRadius: idx == 6 ? '10px' : '0px', //最后一个元素的右下角是圆角的，其他的不是
                            }}
                        >
                            <div
                                className='flex flex-col [&>*]:text-text h-full border-b items-center justify-center py-3'>
                                <h5 className='text-center'>{day.getDate()}.</h5>
                                <h5 className='text-center'>{getWeekDayName(day)}</h5>
                                <div className='flex flex-col h-3 justify-end'>{
                                    areDatesSame(day, new Date()) && <div className='h-1 w-8 bg-primary self-center' /> //如果day是今天，就显示一个蓝色的线
                                }</div>
                            </div>
                        </div>
                    )}
                    {weekDays.map(day =>
                    {
                        return <div
                            key={getDateString(day)}
                            data-key={getDateString(day)}
                            onDragOver={e => onDragOver(e, day)}
                            //阻止默认的拖动行为,在拖放操作中，浏览器的默认行为是在释放鼠标时打开拖动的内容
                            onDrop={e => onDrop(e, day)}
                            className='flex flex-1 gap-4 bg-white py-2 px-4 border-b last:border-b-0 flex-wrap'>
                            {exercisesAndPrescriptions[getDateString(day)]?.map((exerciseSession) =>
                            {
                                if (isPrescription(exerciseSession))
                                {
                                    return <PrescriptionInCalendar
                                        prescription={exerciseSession}
                                        key={exerciseSession.PrescriptionID}
                                        deletePrescription={deletePrescription}
                                        addPendingToDelete={addPendingToDelete}
                                    />
                                } else if (isEditablePrescription(exerciseSession))
                                {
                                    return <EditablePrescriptionInCalendar
                                        prescription={exerciseSession}
                                        key={exerciseSession.PrescriptionID}
                                        setShowingPlanExerciseDialog={setShowingPlanExerciseDialog}
                                        deletePrescription={deleteIsEditablePrescription}
                                    />
                                } else
                                {
                                    return <SessionInCalender
                                        session={exerciseSession}
                                        key={exerciseSession.SessionID} />
                                }
                            }
                            )}
                        </div>
                    }
                    )}
                </>}
            </div>
            <div className={`mt-10 px-6 py-4 flex justify-between`}>
                <h3>Free to play exercises</h3>
                <div className={`flex justify-around gap-10 h-full`}>
                    <span className={`font-semibold`}><FaCircle className={`fill-pink-600 inline`} /> FreeToPlay</span>
                    <span className={`font-semibold`}><FaCircle className={`fill-gray-600 inline`} /> Editable</span>
                </div>
            </div>

            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) =>
                {
                    e.preventDefault();
                    if (currentlyDragged == null) return;
                    //更新freeToPlayProtocols.updated数组，添加新的ProtocolID,并且不允许重复
                    setFreeToPlayProtocols((prevState) =>
                    {
                        if (prevState.updated.includes(currentlyDragged.ProtocolID))
                        {
                            return prevState;
                        }
                        return { ...prevState, updated: [...prevState.updated, currentlyDragged.ProtocolID] };
                    });
                    setCurrentlyDragged(null);
                }}
                className={`bg-white rounded-b-xl py-2 px-4 border-t shadow-lg z-0 flex flex-wrap gap-4`}>
                {freeToPlayProtocols.updated.length === 0 &&
                    <div className="h-24"></div>
                }
                {freeToPlayProtocols.updated.map((protocolID) =>
                {
                    return <FreeToPlayProtocols
                        ProtocolID={protocolID}
                        key={protocolID}
                        freeToPlayProtocols={freeToPlayProtocols}
                        setFreeToPlayProtocols={setFreeToPlayProtocols}
                    />
                })}
            </div>

        </div>
        <div className='flex flex-col flex-1 gap-4 items-stretch w-full h-auto'>
            <ExerciseList setDragged={setCurrentlyDragged} recommended={recommended} setRecommended={setRecommended} />
        </div>
        {showingPlanExerciseDialog && <DialogPlanExercise  //这是一个弹窗，用来设置新的prescription
            day={showingPlanExerciseDialog.day}
            prescriptionID={showingPlanExerciseDialog.prescriptionID}
            onDone={() => setShowingPlanExerciseDialog(null)}
            setExercisesAndPrescriptions={setExercisesAndPrescriptions}
            exercisesAndPrescriptions={exercisesAndPrescriptions}
            reeditPrescription={showingPlanExerciseDialog.reeditPrescription ?? undefined}
            defaultRehybSetup={defaultRehybSetup} patientId={patientId!} pendingToDelete={pendingToDelete} />}
    </div>
}


const SessionInCalender = (props: { session: OnlineVariableSession }) =>
{
    const { data: protocols, isLoading, isError } = useGetAllExerciseProtocolsQuery() //获得所有的protocol
    const [showingDetail, setShowDetail] = useState(false)
    const background = EXERCISE_STATE_COLORS[props.session.SessionInfo.Status] //注意字符串前面有个bg-
    // console.log(props.session); //4.1之前有bug是因为数据库中测试数据不正确
    const matchingProtocol = protocols?.find(protocol => protocol.ProtocolID === props.session.ProtocolInfo.ProtocolID);
    const protocolName = matchingProtocol ? matchingProtocol.ProtocolName : 'Unknown Protocol';
    let Score: number | undefined = undefined;
    if (props.session.SessionInfo.Score && props.session.SessionInfo.Score.length > 0)
    {
        Score = props.session.SessionInfo.Score[props.session.SessionInfo.Score.length - 1].value;
    }
    const ScoreText = (Score || Score === 0) ? (Math.round(Score * 100) + "%") : "?";

    if (isLoading || isError) return <>
        <div
            onDragOver={e => e.stopPropagation()}
            className={`flex shadow-lg rounded-2xl transition-all hover:brightness-110 cursor-pointer h-24 w-[180px]`}
        >
            <div className={`w-4 rounded-l-2xl bg-gray-600 flex-none`}></div>
            <div
                className={`flex-1 py-2 pl-3.5 bg-white flex flex-col rounded-r-2xl justify-center border border-gray-600`}>
                {isLoading && <span>Loading the data</span>}
                {isError && <span>Error loading the data</span>}
            </div>
        </div>
    </>


    return <>
        <div
            onDragOver={e => e.stopPropagation()}
            className={`flex shadow-lg ${background} text-white rounded-2xl transition-all hover:brightness-110 cursor-pointer h-24 w-[180px]`}
            onClick={() => setShowDetail(true)}
        >
            <div className={`w-4 flex-none rounded-l-2xl`}></div>
            <div
                className={`flex-1 py-2 pl-3.5 bg-white/80 flex flex-col rounded-r-2xl justify-center border border-${background.slice(3)}`}>
                <span className='text-sm'><span
                    className={`font-semibold`}>{props?.session?.SessionInfo?.Duration?.toFixed(1) ?? "?"}</span> mins</span>
                <span
                    className={`font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[145px]`}>{protocolName}</span>
                <span className='text-sm'>Score: <span className={`font-semibold`}>{ScoreText}</span></span>
            </div>
        </div>
        {
            showingDetail && <DialogCloseOnly onClose={() => setShowDetail(false)}>
                <DetailAndLabeling sessionId={props.session.SessionID} />
            </DialogCloseOnly>
        }
    </>

}

const EditablePrescriptionInCalendar = (props: {
    prescription: EditablePrescription,
    setShowingPlanExerciseDialog: (value: {
        day: Date,
        prescriptionID: string,
        reeditPrescription?: EditablePrescription
    }) => void,
    deletePrescription: (prescriptionID: string, day: Date) => void
}) =>
{
    const { data: protocols, isLoading, isError } = useGetAllExerciseProtocolsQuery();
    const matchingProtocol = protocols?.find(protocol => protocol.ProtocolID === props.prescription.ProtocolID);
    const protocolName = matchingProtocol ? matchingProtocol.ProtocolName : 'Unknown Protocol';


    if (isLoading || isError) return <>
        <div
            onDragOver={e => e.stopPropagation()}
            className={`flex shadow-lg rounded-2xl transition-all hover:brightness-110 cursor-pointer h-24 w-[180px]`}
        >
            <div className={`w-4 rounded-l-2xl bg-gray-600 flex-none`}></div>
            <div
                className={`flex-1 py-2 pl-3.5 bg-white flex flex-col rounded-r-2xl justify-center border border-gray-600`}>
                {isLoading && <span>Loading the data</span>}
                {isError && <span>Error loading the data</span>}
            </div>
        </div>
    </>

    return <>
        <div
            onDragOver={e => e.stopPropagation()}
            className={`flex relative shadow-lg rounded-2xl transition-all hover:brightness-110 cursor-pointer h-24 w-[180px] `}
            onClick={() => props.setShowingPlanExerciseDialog({
                day: new Date(props.prescription.Date),
                prescriptionID: props.prescription.PrescriptionID,
                reeditPrescription: props.prescription
            })}     //传入了prescription，可以获得prescriptionID和day,也可以根据情况添加reeditPrescription
        >
            <div className={`w-4 rounded-l-2xl bg-gray-600 flex-none border-2 border-dashed border-gray-600`}></div>
            <div
                className={`flex-1 py-2 pl-3.5 bg-white flex flex-col rounded-r-2xl justify-center border border-dashed border-gray-600`}>
                <span className='text-sm'>Approx. <span
                    className={`font-semibold`}>{props.prescription.Duration ?? '?'}</span> mins</span>
                <span
                    className={`font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[145px]`}>{protocolName}</span>
                <span className='text-sm'>Difficulty: <span
                    className={`font-semibold`}>{props.prescription.Difficulty ?? '?'}</span></span>
            </div>
            <IoRemoveCircle className={'fill-red-400 absolute w-[30px] h-[30px] top-0 right-0 hover:fill-red-700'}
                onClick={(event) =>
                {
                    event.stopPropagation();
                    props.deletePrescription(props.prescription.PrescriptionID, new Date(props.prescription.Date))
                }} />
        </div>
    </>
}


const PrescriptionInCalendar = (props: {
    prescription: Prescription,
    deletePrescription: (prescriptionID: string, day: Date) => void,
    addPendingToDelete: (prescriptionID: string) => void
}) =>
{
    const { data: protocols, isLoading, isError } = useGetAllExerciseProtocolsQuery() //获得所有的protocol
    const matchingProtocol = protocols?.find(protocol => protocol.ProtocolID === props.prescription.ProtocolID);
    const protocolName = matchingProtocol ? matchingProtocol.ProtocolName : 'Unknown Protocol';
    const [showingDetail, setShowDetail] = useState(false)

    if (isLoading || isError) return <>
        <div
            onDragOver={e => e.stopPropagation()}
            className={`flex shadow-lg rounded-2xl transition-all hover:brightness-110 cursor-pointer h-24 w-[180px]`}
        >
            <div className={`w-4 rounded-l-2xl bg-gray-600 flex-none`}></div>
            <div
                className={`flex-1 py-2 pl-3.5 bg-white flex flex-col rounded-r-2xl justify-center border border-gray-600`}>
                {isLoading && <span>Loading the data</span>}
                {isError && <span>Error loading the data</span>}
            </div>
        </div>
    </>


    return <>
        <div
            onDragOver={e => e.stopPropagation()}
            className={`flex relative shadow-lg bg-primary text-white rounded-2xl transition-all hover:brightness-110 cursor-pointer h-24 w-[180px]`}
            onClick={() => setShowDetail(true)}
        >
            <div className={`w-4 flex-none rounded-l-2xl`}></div>
            <div
                className={`flex-1 py-2 pl-3.5 bg-white/80 flex flex-col rounded-r-2xl justify-center border border-primary`}>
                <span className='text-sm'>Approx. <span className={`font-semibold`}>{props.prescription.Duration}</span> mins</span>
                <span
                    className={`font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[145px]`}>{protocolName}</span>
                <span className='text-sm'>Difficulty: <span
                    className={`font-semibold`}>{props.prescription.Difficulty}</span></span>
            </div>
            <IoRemoveCircle className={'fill-red-400 absolute w-[30px] h-[30px] top-0 right-0 hover:fill-red-700'}
                onClick={async (event) =>
                {
                    event.stopPropagation();
                    props.deletePrescription(props.prescription.PrescriptionID, new Date(props.prescription.Date))
                    props.addPendingToDelete(props.prescription.PrescriptionID)
                    // const newPrescriptions: EditablePrescription[] = [];
                    // for (const day in props.exercisesAndPrescriptions)
                    // {
                    //     newPrescriptions.push(...props.exercisesAndPrescriptions[day].filter(isEditablePrescription));
                    // }
                    // await updateExercisePlan({
                    //     PatientID: props.patientId!,
                    //     PendingToDelete: props.pendingToDelete,
                    //     EditablePrescriptions: newPrescriptions,
                    // });
                }} />
        </div>
        {
            showingDetail && <DialogCloseOnly onClose={() => setShowDetail(false)}>
                <DetailAndLabeling sessionId={props.prescription.SessionID} />
                {/*ExerciseDetail是张宇轩的Master project的页面*/}
            </DialogCloseOnly>
        }
    </>
}


const FreeToPlayProtocols = (props: {
    ProtocolID: string,
    freeToPlayProtocols: { initial: string[], updated: string[] },
    setFreeToPlayProtocols: (value: { initial: string[], updated: string[] }) => void
}) =>
{
    const { data: protocols, isLoading, isError } = useGetAllExerciseProtocolsQuery() //获得所有的protocol
    const matchingProtocol = protocols?.find(protocol => protocol.ProtocolID === props.ProtocolID);
    const protocolName = matchingProtocol ? matchingProtocol.ProtocolName : 'Unknown Protocol';
    const editable = !props.freeToPlayProtocols.initial.includes(props.ProtocolID);

    if (isLoading || isError) return <>
        <div
            onDragOver={e => e.stopPropagation()}
            className={`flex shadow-lg rounded-2xl transition-all hover:brightness-110 cursor-pointer h-24 w-[180px]`}
        >
            <div className={`w-4 rounded-l-2xl bg-gray-600 flex-none`}></div>
            <div
                className={`flex-1 py-2 pl-3.5 bg-white flex flex-col rounded-r-2xl justify-center border border-gray-600`}>
                {isLoading && <span>Loading the data</span>}
                {isError && <span>Error loading the data</span>}
            </div>
        </div>
    </>


    return <>
        <div
            onDragOver={e => e.stopPropagation()}
            className={`flex relative shadow-lg ${editable ? 'bg-gray-600' : 'bg-pink-600'} text-white rounded-2xl transition-all hover:brightness-110 cursor-pointer h-24 w-[180px]`}
        >
            <div className={`w-4 flex-none rounded-l-2xl`}></div>
            <div
                className={`flex-1 py-2 pl-3.5  flex flex-col rounded-r-2xl justify-center border ${editable ? 'bg-white border-dashed border-gray-600' : 'bg-white/80 border-pink-600'}`}>
                <span
                    className={`font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[145px]`}>{protocolName}</span>
            </div>
            <IoRemoveCircle className={'fill-red-400 absolute w-[30px] h-[30px] top-0 right-0 hover:fill-red-700'}
                onClick={(event) =>
                {
                    event.stopPropagation();
                    //更新freeToPlayProtocols.updated数组，删除ProtocolID,不要用函数式更新，根据props.freeToPlayProtocols新建一个对象，然后更新
                    props.setFreeToPlayProtocols({
                        initial: props.freeToPlayProtocols.initial,
                        updated: props.freeToPlayProtocols.updated.filter(id => id !== props.ProtocolID)
                    });
                }} />
        </div>
    </>
}


// exercisesAndPrescriptions的值是一个对象，对象的键是当地时间的日期字符串，值是OnlineVariableSession类型的数组，表示一天内的所有计划的exercise
// {
//     "2024-04-01": [],
//     "2024-04-02": [],
//     "2024-04-03": [],
//     "2024-04-04": [],
//     "2024-04-05": [],
//     "2024-04-06": [],
//     "2024-04-07": []
// }
