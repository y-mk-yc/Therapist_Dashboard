import React, {FC, lazy, Suspense, useState} from "react";
import {BodyPart, bodyParts} from "./Data";
import {BigSelect} from "../../../common/Inputs";
import {LabeledGraph} from "./common/LabeledGraph";
import {useParams} from "react-router-dom";
import {
    useGetPatientsByPatientIdDataQuery,
    useGetUsermodelByPatientIdQuery
} from "../../../store/rehybApi";
import {Loader} from "../../../common/Loader";
import {createDataConfig} from "./common/lineGraphHelper";
import {LazyPlot} from "../../../common/graphs/LazyPlotly";
import {calculateCondition} from "../overview/CurrentCondition";
import {IoRemoveCircle} from "react-icons/io5";
import {Data} from "plotly.js";
import {GoTriangleDown} from "react-icons/go";

//这个组件用于加载Avatar组件
const LazyAvatar = lazy(() =>
    import('./../../../common/3dVisualisation/3dAvatar').then(module => ({default: module.Avatar})));
//react 的lazy函数，用于动态加载组件，返回一个promise，当组件加载完成时，promise状态变为resolved
//lazy函数接受一个函数，这个函数必须返回一个Promise，该Promise需要resolve一个有default属性的对象，这个对象代表了React组件

const GRAPH_COLORS = {
    shoulder: '#435FE1',
    elbow: '#9AD163',
    wrist: '#F5C14D',
    hand: '#DD5505',
    // cognition: '#d1dbff'
    physical: '#000000',

} as const;

//这个函数生成一个柱形图图像的数据
const createTrace_PatientConditionProgress_Week = (
    traceName: string,
    x: (number | string)[],
    y: number[],
    color: string,
): Plotly.Data => {
    return {
        x: x,
        y: y,
        type: 'bar',
        name: traceName,
        marker: {color: color},
        hoverinfo: 'none',  //这个配合事件可以不显示hover但是点击后出现信息
    }
};

const createTrace_PatientConditionProgress_MonthAndAllTime = (
    traceName: string,
    x: (number | string)[],
    y: number[],
    color: string,
    period: 'Month' | 'AllTime'
): Plotly.Data => ({
    x: x,
    y: y,
    type: 'scatter',
    name: traceName.charAt(0).toUpperCase() + traceName.slice(1),
    mode: period === 'Month' ? 'lines+markers' : 'lines',
    marker: {color: color},
});


const config: Partial<Plotly.Config> = {
    displaylogo: false, //不显示plotly的logo
    displayModeBar: false, //不显示plotly的工具栏
    // responsive: true //响应式
};

interface ConditionData {
    bodyPart?: string;
    Date?: string;
    shoulderROMAA?: number;
    shoulderROMFE?: number;
    shoulderROMIE?: number;
    shoulderEndurance?: number;
    shoulderSpasticityAA?: number;
    shoulderSpasticityFE?: number;
    shoulderSpasticityIE?: number;
    shoulderStrengthAA?: number;
    shoulderStrengthFE?: number;
    shoulderStrengthIE?: number;
    elbowROMFE?: number;
    elbowEndurance?: number;
    elbowSpasticityFE?: number;
    elbowStrengthFE?: number;
    wristROMPS?: number;
    handROMIndexFE?: number;
    handEndurance?: number;
    handSpasticity?: number;
    handStrength?: number;
    shoulderProgress?: number;
    elbowProgress?: number;
    wristProgress?: number;
    handProgress?: number;
    physicalProgress?: number;
}

function formatData(num: number | undefined) {
    if (num === undefined) {
        return 'N/A';
    }
    return Math.round(num * 100) + '%';
}

function findEarliestDate(obj: any): string | null {
    //递归找到stateVariable中最早的Date字段
    let earliestDate: Date | null = null;

    function recurse(currentObj: any) {
        if (Array.isArray(currentObj)) {
            currentObj.forEach(item => recurse(item));
        } else if (typeof currentObj === 'object' && currentObj !== null) {
            for (const key in currentObj) {
                if (key === 'Date' && typeof currentObj[key] === 'string') {
                    const currentDate = new Date(currentObj[key] as string);
                    if (!earliestDate || currentDate < earliestDate) {
                        earliestDate = currentDate;
                    }
                } else {
                    recurse(currentObj[key]);
                }
            }
        }
    }

    recurse(obj);
    return earliestDate ? (earliestDate as Date).toISOString() : null;
}


export const General: FC<{
    setSelectedBodyPart: (part: BodyPart) => void,
    selectedBodyPart: BodyPart
}> = ({setSelectedBodyPart, selectedBodyPart}) => {
    const [period, setPeriod] = useState<'Week' | 'Month' | 'AllTime'>('Week');
    const {patientId} = useParams()
    const {data: SV, isLoading: isLoadingSV} = useGetPatientsByPatientIdDataQuery({PatientID: patientId!})
    const {data: UM, isLoading: isLoadingUM} = useGetUsermodelByPatientIdQuery({PatientID: patientId!})
    const [showProgressDetail, setShowProgressDetail] =
        useState<boolean | ConditionData>(false);
    const [showProgressDetailPosition, setShowProgressDetailPosition] = useState({left: 0, top: 0});

    const cutOffDateMovementCompensation = new Date();
    cutOffDateMovementCompensation.setHours(0, 0, 0, 0);
    if (period === 'Week') {
        cutOffDateMovementCompensation.setDate(cutOffDateMovementCompensation.getDate() - 6);
    } else if (period === 'Month') {
        cutOffDateMovementCompensation.setDate(cutOffDateMovementCompensation.getDate() - 29);
    } else {
        cutOffDateMovementCompensation.setFullYear(1900, 0, 1); //设置为1900年1月1日,极限一点:)
    }
    // console.log({cutOffDateMovementCompensation});


    if (isLoadingSV || isLoadingUM) return <Loader/>
    if (!SV || !UM) return <>No data</>


    let MovementCompensation = [...SV.Physical.MovementCompensation].sort((a, b) => {
        //排序防止数据库中的数据不是按时间顺序排列
        const dateA = new Date(a.Date);
        const dateB = new Date(b.Date);
        if (dateA < dateB) {
            return -1;  // a 应该在 b 前面
        } else if (dateA > dateB) {
            return 1;   // a 应该在 b 后面
        } else {
            return 0;   // a 和 b 相等，保持不变
        }
    });
    // console.log("MovementCompensation", MovementCompensation);
    // if (MovementCompensation.length > 0) {
    //     const lastActiveCompensation = MovementCompensation[MovementCompensation.length - 1];
    //     const today = new Date(new Date().setHours(0, 0, 0, 0));
    //     let i = new Date(lastActiveCompensation.Date);
    //     i.setDate(i.getDate() + 1);
    //     while (i <= today) {
    //         MovementCompensation.push({
    //             TotalCompensation: lastActiveCompensation.TotalCompensation,
    //             Date: new Date(i).toISOString()
    //         });
    //         i.setDate(i.getDate() + 1);
    //     }
    //     MovementCompensation = MovementCompensation.filter(item => new Date(item.Date) >= cutOffDateMovementCompensation);
    // }

    // console.log("MovementCompensation", MovementCompensation);

    const MovementCompensationData = createDataConfig(
        '#435FE1',
        'General movement quality',
        MovementCompensation.map(item =>
            new Date(item.Date).toLocaleDateString('en-CA')),
        MovementCompensation.map(item => parseFloat((1 - item.TotalCompensation).toFixed(1))),
    );
    //这个函数生成一个折线图图像的布局

    const MovementCompensationLayout: Partial<Plotly.Layout> = {
        showlegend: false, //不显示图例
        height: 360,
        xaxis: {
            showline: true, //显示x轴线
            tickformat: '%b-%d', // 设置 X 轴刻度格式为月份和日期
            range: (period === 'Week' || period === 'Month') ? [cutOffDateMovementCompensation.toISOString(), new Date(new Date().setHours(23,59,59,999)).toISOString()] :
                MovementCompensation.length > 0 ? [MovementCompensation[0].Date, new Date(new Date().setHours(23,59,59,999)).toISOString()] : undefined,
            type: 'date', //设置x轴的类型为日期
        },
        yaxis: {
            tickformat: '.0%', // 设置 Y 轴刻度为百分比格式
        },
        margin: {t: 16, b: 16, l: 35, r: 16},
        paper_bgcolor: 'rgba(255,255,255,0)', //图表的背景颜色为透明
        plot_bgcolor: 'rgba(255,255,255,0)', //绘图区域的背景颜色为透明
    };


    let errorString_PatientConditionProgress: string;

    let timeSpan_PatientConditionProgress: string[] = [];
    if (period === 'Week') {
        //这个数组用于记录最近7天的日期，但是是cutOff的时间，要传给calculateCondition函数，所以每天都是当天的23:59:59
        timeSpan_PatientConditionProgress = Array.from({length: 7}, (_, i) => {
            const date = new Date();
            date.setHours(23, 59, 59, 999);
            date.setDate(date.getDate() - 6 + i);
            return date.toISOString();
        });
    } else if (period === 'Month') {
        //这个数组用于记录最近30天的日期，但是是cutOff的时间，要传给calculateCondition函数，所以每天都是当天的23:59:59
        timeSpan_PatientConditionProgress = Array.from({length: 30}, (_, i) => {
            const date = new Date();
            date.setHours(23, 59, 59, 999);
            date.setDate(date.getDate() - 29 + i);
            return date.toISOString();
        });
    } else {
        //获得SV这个对象中所有可能出现的Date字段，然后找到最早的那个
        const earliestDate = findEarliestDate(SV);
        if (!earliestDate) {
            errorString_PatientConditionProgress = `No patient's data found`;
        } else {
            //timeSpan_PatientConditionProgress是从new Date(earliestDate)当天的23:59:59到今天的23:59:59,每一天的ISOString为元素的数组
            const startDate = new Date(earliestDate);
            startDate.setHours(23, 59, 59, 999);
            const endDate = new Date();
            endDate.setHours(23, 59, 59, 999);
            const days = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
            for (let i = 0; i < days + 1; i++) {
                timeSpan_PatientConditionProgress.push(startDate.toISOString());
                startDate.setDate(startDate.getDate() + 1);
            }
        }
    }
    // console.log(timeSpan_PatientConditionProgress);

    const timeSpan_PatientConditionProgress_Data = timeSpan_PatientConditionProgress.map(day => calculateCondition(SV, UM, 'longTerm', day));
    errorString_PatientConditionProgress = timeSpan_PatientConditionProgress_Data.includes(undefined) ? 'You have not set goals for this patient yet.' : '';
    let patientConditionProgressData: Data[] = [];
    if (period === 'Week') {
        const x = timeSpan_PatientConditionProgress.map(date => new Date(date).toLocaleDateString('en-CA'));
        //这时候timeSpan是最近7天的日期，timeSpan_Data是这7天的数据
        let shoulderLastSevenDays, elbowLastSevenDays, wristLastSevenDays, handLastSevenDays;
        let bodyPartsLastSevenDays: {
            shoulder: (number | undefined)[];
            elbow: (number | undefined)[];
            wrist: (number | undefined)[];
            hand: (number | undefined)[];
        };
        if (!errorString_PatientConditionProgress) {
            //这里写这么复杂主要是考虑到数据中可能有undefined的情况，需要做边界处理
            shoulderLastSevenDays = timeSpan_PatientConditionProgress_Data.map(item => item!.shoulderProgress) as (number | undefined)[];
            elbowLastSevenDays = timeSpan_PatientConditionProgress_Data.map(item => item!.elbowProgress) as (number | undefined)[];
            wristLastSevenDays = timeSpan_PatientConditionProgress_Data.map(item => item!.wristProgress) as (number | undefined)[];
            handLastSevenDays = timeSpan_PatientConditionProgress_Data.map(item => item!.handProgress) as (number | undefined)[];
            const divisors: number[] = new Array(7).fill(4); //这个数组用于记录每一天有多少个部位的数据
            for (let i = 0; i < timeSpan_PatientConditionProgress_Data.length; i++) {
                //如果shoulderLastSevenDays[i]为undefined，则对应的divisor[i]减1，其他同理
                if (shoulderLastSevenDays[i] === undefined) {
                    divisors[i]--;
                }
                if (elbowLastSevenDays[i] === undefined) {
                    divisors[i]--;
                }
                if (wristLastSevenDays[i] === undefined) {
                    divisors[i]--;
                }
                if (handLastSevenDays[i] === undefined) {
                    divisors[i]--;
                }
            }
            if (divisors.every((divisor: number) => divisor === 0)) {
                errorString_PatientConditionProgress = 'No data available'; //这里表示某一天的progress数据中四个部位的值都是undefined
            } else {
                for (let i = 0; i < timeSpan_PatientConditionProgress_Data.length; i++) {
                    if (shoulderLastSevenDays[i] !== undefined) {
                        shoulderLastSevenDays[i] = shoulderLastSevenDays[i]! / divisors[i];
                    }
                    if (elbowLastSevenDays[i] !== undefined) {
                        elbowLastSevenDays[i] = elbowLastSevenDays[i]! / divisors[i];
                    }
                    if (wristLastSevenDays[i] !== undefined) {
                        wristLastSevenDays[i] = wristLastSevenDays[i]! / divisors[i];
                    }
                    if (handLastSevenDays[i] !== undefined) {
                        handLastSevenDays[i] = handLastSevenDays[i]! / divisors[i];
                    }
                }
            }
            bodyPartsLastSevenDays = {
                shoulder: shoulderLastSevenDays,
                elbow: elbowLastSevenDays,
                wrist: wristLastSevenDays,
                hand: handLastSevenDays
            };
            console.log("bodyPartsLastSevenDays",bodyPartsLastSevenDays);
            patientConditionProgressData = ([
                'shoulder',
                'elbow',
                'wrist',
                'hand',
                // 'cognition'
            ] as const).map((part) =>
                createTrace_PatientConditionProgress_Week(part, x, bodyPartsLastSevenDays[part] as number[], GRAPH_COLORS[part])
            );
        }
    } else {
        const x = timeSpan_PatientConditionProgress.map(date => new Date(date).toLocaleDateString('en-CA'));
        if (!errorString_PatientConditionProgress) {
            // console.log(timeSpan_PatientConditionProgress_Data);
            //这下面如果item是undefined,前面的errorString_PatientConditionProgress已经处理了
            const shoulder = timeSpan_PatientConditionProgress_Data.map(item => item!.shoulderProgress) as number[];
            const elbow = timeSpan_PatientConditionProgress_Data.map(item => item!.elbowProgress) as number[];
            const wrist = timeSpan_PatientConditionProgress_Data.map(item => item!.wristProgress) as number[];
            const hand = timeSpan_PatientConditionProgress_Data.map(item => item!.handProgress) as number[];
            const physical = timeSpan_PatientConditionProgress_Data.map(item => item!.physicalProgress) as number[];

            const bodyParts = ['shoulder', 'elbow', 'wrist', 'hand', 'physical'] as const;
            const yValues = [shoulder, elbow, wrist, hand, physical];

            patientConditionProgressData = bodyParts.map((part, index) =>
                createTrace_PatientConditionProgress_MonthAndAllTime(part, x, yValues[index], GRAPH_COLORS[part], period));

        }
    }

    const patientConditionProgressLayout: Partial<Plotly.Layout> = {
        barmode: 'stack', //堆叠模式，即多个柱形图堆叠在一起
        height: period === 'Week' ? 360 : 400,  //320px的高度
        margin: {t: 16, b: 16, l: 35, r: 16},
        xaxis: {
            tickformat: '%b-%d' // 设置 X 轴刻度格式为月份和日期
        },
        yaxis: {
            range: [0, 1],    // 设置y轴的范围从0到1
            dtick: 0.1,       // 设置y轴的刻度间隔为0.1
            tick0: 0,         // 设置y轴的起始刻度为0
            tickmode: 'linear', // 设置刻度模式为线性
            tickformat: '.0%' // 设置y轴刻度的格式为百分比，没有小数点
        },
        paper_bgcolor: 'rgba(255,255,255,0)', //图表的背景颜色为透明
        plot_bgcolor: 'rgba(255,255,255,0)', //绘图区域的背景颜色为透明
        showlegend: period !== 'Week',
        legend: {
            orientation: 'h', // 设置图例为水平方向
            xanchor: 'center', // 将图例的x锚点设置为中心
            yanchor: 'bottom', // 将图例的y锚点设置为底部
            x: 0.5, // 将图例在x方向上居中放置
            y: -0.2 // 将图例在y方向上向下移动，负值表示图例会放在绘图区域的下方
        },
    };


    return <div className={'flex flex-col w-full overflow-auto'}>
        <div className={`flex justify-between items-center`}>
            <BigSelect
                onValueSet={value => setSelectedBodyPart(value as BodyPart)}
                value={selectedBodyPart} values={bodyParts.map(part => ({value: part, text: part}))}
                className={`ml-5`}
            />
            <div className='flex justify-between gap-4'>
                <button className={"flex flex-col items-center"} onClick={() => setPeriod('Week')}>
                    <span className={`btn-text ${period == 'Week' ? 'font-bold' : ''}`}>Week</span>{period == 'Week' &&
                    <GoTriangleDown className={`fill-primary`}/>}
                </button>
                <button className={"flex flex-col items-center"} onClick={() => setPeriod('Month')}>
                    <span
                        className={`btn-text ${period == 'Month' ? 'font-bold' : ''}`}>Month</span>{period == 'Month' &&
                    <GoTriangleDown className={`fill-primary`}/>}
                </button>
                <button className={"flex flex-col items-center"} onClick={() => setPeriod('AllTime')}>
                    <span
                        className={`btn-text ${period == 'AllTime' ? 'font-bold' : ''}`}>All time</span>{period == 'AllTime' &&
                    <GoTriangleDown className={`fill-primary`}/>}
                </button>
            </div>
        </div>
        <div className={'flex gap-16 px-8 pt-2 w-full flex-nowrap justify-center'}>
            <div className={'flex flex-col gap-4 flex-[2]'}>
                <LabeledGraph
                    label={'General movement quality'}
                    tip={`Estimated average amount of compensatory movement.`}
                    innerClassName={`w-[500px]`}
                    //classNameTip向右偏移自身宽度
                    classNameTip={`w-[300px]`}
                >
                    <LazyPlot data={[MovementCompensationData]}
                              layout={MovementCompensationLayout}
                              config={config}
                    />
                </LabeledGraph>
                <LabeledGraph
                    label={'Patient condition progress'}
                    tip={`A composite score of all body parts scores. Each body part score is calculated as 
                    a percentage of healthy person score for ranges of motion, strength, spasticity and time 
                    to fatigue.`}
                    innerClassName={`w-[500px] relative`}
                >
                    {!errorString_PatientConditionProgress && (period === 'Week') &&
                        <>
                            <LazyPlot data={patientConditionProgressData}
                                      layout={patientConditionProgressLayout}
                                      config={config}
                                      onClick={(e) => {
                                          if (e.points.length > 0) {
                                              const bodyPart = e.points[0].data.name;
                                              const cutOffDate = new Date(e.points[0].x as string);
                                              cutOffDate.setHours(23, 59, 59, 999);
                                              const conditionData = calculateCondition(SV, UM, 'longTerm', cutOffDate.toISOString());
                                              const newConditionData: ConditionData = {
                                                  ...conditionData,
                                                  bodyPart: bodyPart,
                                                  Date: cutOffDate.toLocaleDateString('en-CA')
                                              };
                                              setShowProgressDetail(newConditionData);
                                              const left = e.event.offsetX;
                                              const top = e.event.offsetY;
                                              setShowProgressDetailPosition({left: left, top: top});
                                          }
                                      }}
                                      onHover={(e) => {
                                          const chart = e.event.target as HTMLElement;
                                          chart.style.cursor = e.points.length > 0 ? 'pointer' : 'default';
                                      }}
                            />
                            {showProgressDetail && (
                                <div
                                    className={`absolute flex flex-col bg-white rounded-xl shadow p-2 w-72 border z-50`}
                                    style={{
                                        left: showProgressDetailPosition.left,
                                        top: showProgressDetailPosition.top,
                                        transform: 'translateY(-100%)',
                                        borderColor: GRAPH_COLORS[(showProgressDetail as ConditionData).bodyPart as 'shoulder' | 'elbow' | 'wrist' | 'hand']
                                    }}
                                >
                                    <div className={`flex justify-center relative`}>
                                        <div
                                            style={{color: GRAPH_COLORS[(showProgressDetail as ConditionData).bodyPart as 'shoulder' | 'elbow' | 'wrist' | 'hand']}}>{(showProgressDetail as ConditionData).Date}</div>
                                        <IoRemoveCircle
                                            className={'fill-red-400 absolute w-[20px] h-[20px] -top-2 -right-2 hover:fill-red-700 hover:cursor-pointer'}
                                            onClick={() => setShowProgressDetail(false)}
                                        />
                                    </div>
                                    <div className={`flex justify-between`}>
                                        <div className={`font-bold`}>Physical Progress(Overall):</div>
                                        <div>{formatData((showProgressDetail as ConditionData).physicalProgress)}</div>
                                    </div>
                                    {(showProgressDetail as ConditionData).bodyPart === 'shoulder' && <div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>Shoulder Progress:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).shoulderProgress)}</div>
                                        </div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>ROMAA:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).shoulderROMAA)}</div>
                                        </div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>ROMFE:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).shoulderROMFE)}</div>
                                        </div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>ROMIE:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).shoulderROMIE)}</div>
                                        </div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>Endurance:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).shoulderEndurance)}</div>
                                        </div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>SpasticityAA:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).shoulderSpasticityAA)}</div>
                                        </div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>SpasticityFE:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).shoulderSpasticityFE)}</div>
                                        </div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>SpasticityIE:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).shoulderSpasticityIE)}</div>
                                        </div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>StrengthAA:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).shoulderStrengthAA)}</div>
                                        </div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>StrengthFE:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).shoulderStrengthFE)}</div>
                                        </div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>StrengthIE:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).shoulderStrengthIE)}</div>
                                        </div>
                                    </div>}
                                    {(showProgressDetail as ConditionData).bodyPart === 'elbow' && <div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>Elbow Progress:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).elbowProgress)}</div>
                                        </div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>ROMFE:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).elbowROMFE)}</div>
                                        </div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>Endurance:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).elbowEndurance)}</div>
                                        </div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>SpasticityFE:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).elbowSpasticityFE)}</div>
                                        </div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>StrengthFE:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).elbowStrengthFE)}</div>
                                        </div>
                                    </div>}
                                    {(showProgressDetail as ConditionData).bodyPart === 'wrist' && <div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>Wrist Progress:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).wristProgress)}</div>
                                        </div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>ROMPS:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).wristROMPS)}</div>
                                        </div>
                                    </div>}
                                    {(showProgressDetail as ConditionData).bodyPart === 'hand' && <div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>Hand Progress:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).handProgress)}</div>
                                        </div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>ROMIndexFE:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).handROMIndexFE)}</div>
                                        </div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>Endurance:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).handEndurance)}</div>
                                        </div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>Spasticity:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).handSpasticity)}</div>
                                        </div>
                                        <div className={`flex justify-between`}>
                                            <div className={`font-bold`}>Strength:</div>
                                            <div>{formatData((showProgressDetail as ConditionData).handStrength)}</div>
                                        </div>
                                    </div>}
                                </div>
                            )}
                        </>
                    }
                    {!errorString_PatientConditionProgress && (period === 'Month' || period === 'AllTime') &&
                        <LazyPlot data={patientConditionProgressData}
                                  layout={patientConditionProgressLayout}
                                  config={config}
                        />

                    }

                    {errorString_PatientConditionProgress && <div>{errorString_PatientConditionProgress}</div>}
                    {(period === 'Week') && <div className={`flex justify-around`}>
                        {/*生成四个legend方块*/}
                        <div className={'flex gap-2 items-center'}>
                            <div className={`w-4 h-4`} style={{backgroundColor: GRAPH_COLORS.shoulder}}/>
                            <div>Shoulder</div>
                        </div>
                        <div className={'flex gap-2 items-center'}>
                            <div className={'w-4 h-4'} style={{backgroundColor: GRAPH_COLORS.elbow}}/>
                            <div>Elbow</div>
                        </div>
                        <div className={'flex gap-2 items-center'}>
                            <div className={'w-4 h-4'} style={{backgroundColor: GRAPH_COLORS.wrist}}/>
                            <div>Wrist</div>
                        </div>
                        <div className={'flex gap-2 items-center'}>
                            <div className={'w-4 h-4'} style={{backgroundColor: GRAPH_COLORS.hand}}/>
                            <div>Hand</div>
                        </div>
                    </div>}
                </LabeledGraph>
            </div>
            <div className={'flex flex-col gap-2 flex-[3]'}>
                <Suspense fallback={<Loader/>}>
                    <LazyAvatar/>
                    {/*<div>sads</div>*/}
                </Suspense>
            </div>
        </div>
    </div>
}