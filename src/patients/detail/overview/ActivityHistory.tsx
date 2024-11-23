import * as R from 'rambda'
import {useGetPatientsByPatientIdExerciseSessionsQuery} from '../../../store/rehybApi'
import {getDurationAsDayPercentage, getTimeAsDayPercentage} from '../../../common/dateUtils'
import {useParams} from "react-router-dom";
import {Loader} from "../../../common/Loader";

export const ActivityHistory = () => {
    const {patientId} = useParams()
    const {data, isLoading} = useGetPatientsByPatientIdExerciseSessionsQuery(
        {PatientID: patientId!}
    )
    //R.range(0, 13) => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const evenHours = R.range(0, 13).map(hour => hour * 2) // [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]
    // console.log(data?.length)
    //TODO:data中的exercise可能要考虑Unfinished,Aborted,Skipped等情况,这里只考虑了Unfinished的情况,即以为只要是Unfinished,就是exercise正在running
    //width可能要调整

    if (isLoading) return <Loader/>

    return <div className='flex flex-col gap-2 mt-2'>
        <svg width="100%" className='bg-tertiary rounded h-20'>
            {data?.map(exercise =>
                <rect width={getDurationAsDayPercentage(
                    new Date(exercise.Data.CommonEvents.ProtocolStart),
                    exercise.Data.CommonEvents.ProtocolFinished ? new Date(exercise.Data.CommonEvents.ProtocolFinished) : new Date()
                ) + '%'} //矩形的宽度，即矩形占svg画布的百分比，svg画布的宽度是100%,表示一整天
                      x={getTimeAsDayPercentage(new Date(exercise.Data.CommonEvents.ProtocolStart)) + '%'} //矩形的x坐标，即矩形的左上角的横坐标
                      height="100%"
                      className='fill-positive opacity-20'
                      key={exercise.SessionID}
                />
            )}
        </svg>
        <div className='flex w-full justify-between [&>*:nth-child(even)]:hidden lg:[&>*:nth-child(even]:block'>
            {evenHours.map(hour => <span key={hour}>{hour}:00</span>)}
            {/*从0:00到24:00，每隔两个小时出现一次<span>*/}
        </div>
    </div>
}

// [...]: 方括号表示一个属性选择器，用于选择具有特定属性的元素。
// &: 表示当前元素，在这里指的是应用了这个类的 <div> 元素。
// >: 是子代选择器，表示选择当前元素的直接子元素。
// *: 通配符选择器，表示选择所有子元素。
// :nth-child(even): 是一个伪类选择器，用于选择偶数位置的子元素（第2个、第4个等）。这里是2:00 6:00 10:00 14:00 18:00 22:00。
// :hidden: 是一个伪类，表示隐藏选中的元素。
// 综合起来，[&>*:nth-child(even)]:hidden 的意思是：
// 对于应用了这个类的 <div> 元素，选择它的所有偶数位置的直接子元素，并将其隐藏。
// 在小屏幕和中屏幕尺寸下（即 lg 断点以下），偶数位置的子元素会被隐藏。
// 在大屏幕尺寸及以上（即 lg 断点及以上），偶数位置的子元素会显示为块级元素。