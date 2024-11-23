import {useEffect, useState} from 'react'
import {AiOutlineCheckCircle} from 'react-icons/ai'
import {Chip} from './common/Chip'
import {useParams, useLocation} from "react-router-dom";
import {
    ExerciseCompletionRate,
    useGetExerciseCompletionRateQuery,
    useGetPatientPrescriptionsQuery,
    Prescription,
    useGetTodaysExercisesStatusQuery
} from "../../../store/rehybApi";
import {Loader} from "../../../common/Loader";
import {isDateToday} from "../../../common/dateUtils";
import {EXERCISE_STATE_COLORS} from "../../../common/ExerciseColors";
import {LazyPlot} from "../../../common/graphs/LazyPlotly";
import {GoTriangleRight} from "react-icons/go";

const createPieData: (data: number[]) => Plotly.Data[] = (data) => [
    {
        values: data,
        marker: {
            colors: [
                '#74e03e', // Assuming green for Finished
                '#e0ca3e', // Assuming yellow for Unfinished
                '#ff6347', // Assuming red for Skipped
                '#ADD8E6',  // Assuming grey for Planned
            ]
        },
        domain: {column: 0}, //指定饼图应该占据的区域。如果有多个饼图，则可以使用 column 和 row 来指定它们的位置。这里为第一列
        hole: 0.7, //创建一个环形饼图（也称为甜甜圈图），其中 .7 表示环形的大小。值越接近 1，环形中间的空白区域就越大。 0 表示一个标准的饼图。
        type: 'pie',
        textinfo: 'none' //设置不在饼图的扇区上显示文本信息
    },
    {
        values: [1],
        marker: {
            colors: ['#74e03e'] // 内圆颜色
        },
        domain: {x: [0.24, 0.76], y: [0.24, 0.76]}, // 调整内圆的大小和位置
        hole: data.reduce((sum, count) => sum + count, 0) > 0 ? 0 : 1, //如果总数大于0，则内圆为0，否则为1
        type: 'pie',
        textinfo: 'none',
        hoverinfo: 'none',
        showlegend: false
    }
]

const layout: (completionRate: number, totalExercises: number) => Partial<Plotly.Layout> =
    (completionRate, totalExercises) => ({ //Partial<Plotly.Layout>表示Plotly.Layout的部分类型
        autosize: true, //自动调整图表大小以适应其容器的大小
        showlegend: false, //不显示图例
        height: 120, //高120px
        width: 120,
        margin: {t: 0, b: 0, l: 0, r: 0},
        annotations: [ //注释数组，用于在图表中添加注释
            {
                font: {
                    size: 19,
                    color: "white",
                    family: "Arial, sans-serif",
                    weight: "bold"

                },
                showarrow: false,
                text: totalExercises > 0 ? `${Math.round(completionRate * 100)}%` : "",
                x: 0.5,
                y: 0.5,
            }
        ]
    });

const config: Partial<Plotly.Config> = {
    staticPlot: true, //表示生成的图表将是静态的，即不支持交互功能，如缩放、平移或悬停事件等。
};

export const Completion = () => {
    const [period, setPeriod] = useState<keyof ExerciseCompletionRate>('allTime')
    const {patientId} = useParams()
    const {data: exerciseComp, refetch:refetchComp} = useGetExerciseCompletionRateQuery({PatientID: patientId!})

    // exerciseComp的数据结构如下
    // {
    //     week: { Finished: 1, Unfinished: 0, Skipped: 1, Planned: 0 },
    //     month: { Finished: 2, Unfinished: 0, Skipped: 1, Planned: 0 },
    //     allTime: { Finished: 6, Unfinished: 4, Skipped: 5, Planned: 9 }
    // }
    const {
        data: exerciseData,
        isLoading: exercisesLoading,
        isError: exercisesError,
        refetch: refetchExercises
    } = useGetPatientPrescriptionsQuery({PatientID: patientId!})  //获得患者今天的处方，data是Prescription数组

    //在页面加载时，或者路由变化时，重新获取数据
    const location = useLocation();
    useEffect(() => {
        refetchComp();
        refetchExercises();
    },[location.pathname]);


    // console.log("prescription", exerciseData);
    // console.log("exercises", exerciseComp);


    if (!exerciseComp) return <Loader/>

    let completionData = [0, 0, 0, 0];

    if (period == 'week') {
        completionData = [
            exerciseComp?.week.Finished,
            exerciseComp?.week.Unfinished,
            exerciseComp?.week.Skipped,
            exerciseComp?.week.Planned
        ]
    } else if (period == 'month') {
        completionData = [
            exerciseComp?.month.Finished,
            exerciseComp?.month.Unfinished,
            exerciseComp?.month.Skipped,
            exerciseComp?.month.Planned
        ]
    } else if (period == 'allTime') {
        completionData = [
            exerciseComp?.allTime.Finished,
            exerciseComp?.allTime.Unfinished,
            exerciseComp?.allTime.Skipped,
            exerciseComp?.allTime.Planned
        ]
    }

    const totalExercises = completionData.reduce((prev, current) => prev + current, 0);

    const completionRate = totalExercises > 0 ? completionData[0] / totalExercises : 0;


    return <div className='flex flex-col [&>div>h3]:mb-1 flex-wrap gap-6'>
        <div className='flex flex-col flex-1 border-r'>
            <h3>Exercise Completion Rate</h3>
            <div className='flex items-center justify-between gap-4'>
                <div className='flex flex-col mt-2'>
                    <button className={"flex items-center"} onClick={() => setPeriod('week')}>
                        <span
                            className={`btn-text ${period == 'week' ? 'font-bold' : ''}`}>Week</span>{period == 'week' &&
                        <GoTriangleRight className={`fill-primary`}/>}
                    </button>
                    <button className={"flex items-center"} onClick={() => setPeriod('month')}>
                        <span
                            className={`btn-text ${period == 'month' ? 'font-bold' : ''}`}>Month</span>{period == 'month' &&
                        <GoTriangleRight className={`fill-primary`}/>}
                    </button>
                    <button className={"flex items-center"} onClick={() => setPeriod('allTime')}>
                        <span
                            className={`btn-text ${period == 'allTime' ? 'font-bold' : ''}`}>All time</span>{period == 'allTime' &&
                        <GoTriangleRight className={`fill-primary`}/>}
                    </button>
                </div>
                <div className='flex flex-col h-32'>
                    <LazyPlot layout={layout(completionRate, totalExercises)} data={createPieData(completionData)}
                              config={config}/>
                </div>
                <div className='grid grid-cols-[1fr_minmax(30px,0.1fr)] gap-x-2 gap-y-1 pr-2
                    [&>*]:whitespace-nowrap [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span:nth-child(even)]:justify-center'>
                    <span className='font-bold text-text mb-2'>In Total</span>
                    <span className='font-bold text-text'>
                        {totalExercises}
                    </span>
                    <span><Chip className={EXERCISE_STATE_COLORS.Finished}/>Finished</span>
                    <span className='font-bold text-[#74e03e]'>{completionData[0]}</span>
                    <span><Chip className={EXERCISE_STATE_COLORS.Unfinished}/>Unfinished</span>
                    <span className='font-bold text-[#e0ca3e]'>{completionData[1]}</span>
                    <span><Chip className={EXERCISE_STATE_COLORS.Skipped}/>Skipped</span>
                    <span className='font-bold text-negative'>{completionData[2]}</span>
                    <span><Chip className={EXERCISE_STATE_COLORS.Planned}/>Planned</span>
                    <span className='font-bold text-secondary'>{completionData[3]}</span>
                </div>
            </div>
        </div>
        {<div className='flex flex-col flex-1 gap-2'>
            <h3>Today's Exercises</h3>
            {exercisesLoading && <Loader/>}
            {exercisesError && <span>Failed loading exercises</span>}
            {exerciseData && exerciseData.length === 0 && <span>No exercises today</span>}
            {exerciseData && exerciseData.length > 0 && <TodaysExercises
                sessionIDs={exerciseData}/>}
            <div
                className='flex [&>span]:flex [&>span]:gap-2 [&>span]:items-center [&>span]:text-text whitespace-nowrap'>
                <span className={`flex-auto`}><Chip className={EXERCISE_STATE_COLORS.Finished}/>Finished</span>
                <span className={`flex-auto`}><Chip className={EXERCISE_STATE_COLORS.Unfinished}/>In Progress</span>
                <span className={`flex-auto`}><Chip className={EXERCISE_STATE_COLORS.Planned}/>Scheduled</span>
                <span className={`flex-auto`}><Chip className={EXERCISE_STATE_COLORS.Skipped}/>Skipped</span>
            </div>
        </div>}
    </div>
}


const TodaysExercises = (props: { sessionIDs: string[] }) => {
    const sessionIDs = props.sessionIDs;
    const {data, isError} = useGetTodaysExercisesStatusQuery({sessionIDs: sessionIDs});
    if (isError || !data) return <></>; //返回的值是已经排序好的

    // 按照sessionStatus对exercises进行分组
    const groupedExercises = data.reduce((groups: { [key: string]: string[] }, exercise) => {
        const {sessionStatus, protocolName} = exercise;
        if (!groups[sessionStatus]) {
            groups[sessionStatus] = [];
        }
        groups[sessionStatus].push(protocolName);
        return groups;
    }, {});

    return <>{Object.entries(groupedExercises).map(([status, exercises], i) => (
        <div key={i} className="grid grid-cols-4 gap-2">
            {(exercises.map((exercise, j) => (
                <div key={j} className="flex items-center gap-2">
                    {status === 'Finished' && <AiOutlineCheckCircle className="w-6 h-6 flex-shrink-0 fill-positive"/>}
                    {status === 'Unfinished' && <AiOutlineCheckCircle className="w-6 h-6 flex-shrink-0 fill-middle"/>}
                    {status === 'Planned' && <AiOutlineCheckCircle className="w-6 h-6 flex-shrink-0 fill-secondary"/>}
                    {status === 'Skipped' && <AiOutlineCheckCircle className="w-6 h-6 flex-shrink-0 fill-negative"/>}
                    <span className="text-text whitespace-nowrap overflow-hidden text-ellipsis">{exercise}</span>
                </div>
            )))}
        </div>
    ))}
    </>
};


// export type Prescription = {
//     PrescriptionID: string;
//     Date: string; // ISO Date String
//     PatientID: string;
//     ProtocolID: string;
//     SessionID: string;
//     Duration: number; // Assuming this is in minutes
//     Difficulty: number; // Assuming this is a numeric scale
//     ReHybSetup: string;
//     //Status: 'Skipped' | 'Completed' | 'Planned' | 'In Progress'; // Add other possible statuses if necessary
// };

