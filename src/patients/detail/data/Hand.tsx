import React, { useEffect, useRef, useState } from 'react'
import { AllTimeData, AllTimeDataFinger, HandMetrics, JointExerciseState, MonthData, MonthDataFinger, useGetHandUsermodelByPatientIdQuery, useGetLastestSessionByPatientIdQuery, useGetStateOfAJointbyPatientIdQuery, UserState, WeekData, WeekDataFinger } from '../../../store/dataApi';
import { useParams } from 'react-router-dom';
import { Loader } from '../../../common/Loader';
import { Dexterity, FingerCoordination, FingerIndependence, GripStrength, JointAdducationAbduction, JointFlexionExtnesion, MovementPrecision, MovementSpeed, Pain, ROM } from './bodyPart/hand/HandRangeGraph';
import { Chrono } from "react-chrono";
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
// or
import 'react-tabs/style/react-tabs.scss';
// or
import 'react-tabs/style/react-tabs.less';
import { TfiHandOpen } from 'react-icons/tfi';
const Hand = (props: {
    period: 'Week' | 'Month' | 'AllTime',
    contrast: string
}) =>
{
    const [jointExerciseState, setJointExerciseState] = useState<JointExerciseState>();
    const [userState, setUserState] = useState<UserState>();
    const [joint, setJoint] = useState<{ mode: string, clicked: string }>({ mode: 'hand', clicked: 'Finger1Distal' })
    // ({ mode: 'joint', clicked: 'Finger1Distal' })
    const [mode, setMode] = useState('hand'); //Hand, finger, joint
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [hasAdAb, setHasAdAb] = useState<boolean>(false) // only PIP joints get true

    // const [selectedDate, setSelectedDate] = useState(0);
    // const [timeIndex, setTimeIndex] = useState(0);
    const [allDates, setAllDates] = useState([]);
    // const [contrast, setContrast] = useState<string>(contrastSet['NOCONTENT']);
    const { patientId } = useParams();

    const [selectedRotateDirection, setSelectedRotateDirection] = useState<'FE' | 'DB'>('FE')
    // Fetch data from queries
    const { data: jointExerciseStateData, isLoading, isError } = useGetLastestSessionByPatientIdQuery({
        PatientID: patientId!
    });
    const { data: userStateData, isLoading: isLoadingUM, isError: isErrorUM } = useGetHandUsermodelByPatientIdQuery({
        PatientID: patientId!
    });
    const { data: stateOfAJoint, isLoading: stateLoading, isError: stateError } = useGetStateOfAJointbyPatientIdQuery({
        PatientID: patientId!,
        joint: joint?.clicked,
        period: props.period
    })
    const [metricsData, setMetricsData] = useState<HandMetrics>({
        Week: WeekData, Month: MonthData, AllTime: AllTimeData
    })
    // Function to send data to Vue app
    const sendUserStateandExerciseToVue = () =>
    {
        iframeRef.current?.contentWindow?.postMessage({ type: 'initial', data: { jointExerciseState, userState } }, "*");
    };
    const sendContrastToVue = () =>
    {
        iframeRef.current?.contentWindow?.postMessage({ type: 'contrast', data: props.contrast }, "*");
    };
    const sendSelectedRotateDirection = (value: 'FE' | 'DB') =>
    {
        iframeRef.current?.contentWindow?.postMessage({ type: 'rotationDirection', data: value }, "*");
    };

    const onReceivedMessage = (event: any) =>
    {
        if (event.data.type === "vue-ready")
        {
            console.log("Vue app is ready");
            // Send data to Vue if both states are ready
            if (jointExerciseState && userState)
            {
                sendUserStateandExerciseToVue();
            }
        } else if (event.data.type === "joint")
        {
            console.log(event.data);
            setJoint(event.data.data)
            setMode(event.data.data.mode)
            // Update Metrics Data into the metric of evry joint
            setMetricsData({
                Week: WeekDataFinger, Month: MonthDataFinger, AllTime: AllTimeDataFinger
            })
            if (event.data.data.clicked.includes('Proximal'))
                setHasAdAb(true)
            else setHasAdAb(false)
        }
    };

    useEffect(() =>
    {
        // Set state once data is fetched
        if (jointExerciseStateData && userStateData)
        {
            setJointExerciseState(jointExerciseStateData);
            setUserState(userStateData);
        }
    }, [jointExerciseStateData, userStateData]);

    useEffect(() =>
    {
        // Listen to messages from Vue app
        window.addEventListener("message", onReceivedMessage);
        return () =>
        {
            window.removeEventListener("message", onReceivedMessage);
        };
    });

    // When click a new contrast, sned it to Vue
    useEffect(() =>
    {
        console.log('Send new contrast to Vue...')
        sendContrastToVue()
    }, [props.contrast]);

    // Trigger send when both jointExerciseState and userState are ready
    useEffect(() =>
    {
        if (jointExerciseState && userState)
        {
            sendUserStateandExerciseToVue();
        }
    }, [jointExerciseState, userState]);


    if (isLoading || isLoadingUM) return <Loader />;
    if (isErrorUM) return <>404 Error!</>;

    const getName = (nameFromVue?: { mode: string, clicked: string } | null): string | null =>
    {
        if (nameFromVue)
        {

            const { mode, clicked } = nameFromVue
            const match = clicked.match(/\d+/);
            var number = '';
            if (match)
                number = match[0];
            else return null
            if (mode === 'finger')
            {
                return fingerName[number]
            } else if (mode === 'joint')
            {
                if (match)
                {
                    const finger = fingerName[number];
                    const jointName = clicked.split(number)[1]
                    if (finger)
                    {
                        return `${finger} ${jointName} joint`;
                    }
                }
            } else
            {
                return 'Hand'
            }
        }
        return null;
    };
    const reloadIframe = () =>
    {
        // Update the metrics
        setMode('hand')
        setMetricsData({
            Week: WeekData, Month: MonthData, AllTime: AllTimeData
        })
        // Reload the 3D model
        if (iframeRef.current)
        {
            iframeRef.current.src = iframeRef.current.src;
        }
    };

    const backToNatureGesture = () =>
    {
        console.log('Send Back to Nature')
        iframeRef.current?.contentWindow?.postMessage({ type: 'nature' }, "*");
    }
    return (
        <div className="flex w-full h-screen overflow-x-auto">
            {/* Left Side */}
            <div className="w-2/3 overflow-y-auto no-scrollbar p-4">

                {!stateLoading && !stateError && (
                    <>
                        <Tabs>
                            <TabList className="flex space-x-4 bg-gray-200 pt-2 px-4 pb-0 rounded-lg w-2/3">
                                <Tab
                                    selectedClassName='bg-tertiary'
                                    className="py-2 px-4 text-gray-700 hover:text-blue-500 hover:bg-gray-100 transition-all duration-300 rounded-md ">
                                    ROM
                                </Tab>
                                <Tab selectedClassName='bg-tertiary'
                                    className="py-2 px-4 text-gray-700 hover:text-blue-500 hover:bg-gray-100 transition-all duration-300 rounded-md ">

                                    Quality
                                </Tab>

                                <Tab selectedClassName='bg-tertiary'
                                    className="py-2 px-4 text-gray-700 hover:text-blue-500 hover:bg-gray-100 transition-all duration-300 rounded-md ">
                                    Perception
                                </Tab>
                            </TabList>

                            {/* 2xl:grid-cols-2 */}
                            <TabPanel>
                                <div className="grid grid-cols-1  gap-4">
                                    {
                                        mode !== 'hand' && (
                                            <>
                                                <JointFlexionExtnesion data={stateOfAJoint?.Xrotation} period={props.period} title={getName(joint)} />
                                                {hasAdAb && <JointAdducationAbduction data={stateOfAJoint?.Yrotation} period={props.period} title={getName(joint)} />}
                                            </>
                                        )
                                    }
                                    <ROM data={metricsData[props.period].Rom} period={props.period} title={getName(joint)} />
                                    <GripStrength data={metricsData[props.period].GripStrength} period={props.period} title={getName(joint)} />
                                </div>
                            </TabPanel>
                            {/* 2xl:grid-cols-2 */}
                            <TabPanel>
                                <div className="grid grid-cols-1  gap-4">
                                    <MovementPrecision data={metricsData[props.period].Precision} period={props.period} title={getName(joint)} />
                                    {/* <MovementAccuracy data={metricsData[props.period].MovementAccuracy} period={props.period} title={getName(joint)} /> */}
                                    <MovementSpeed data={metricsData[props.period].MovementSpeed} period={props.period} title={getName(joint)} />
                                    <FingerCoordination data={metricsData[props.period].FingerCoordination} period={props.period} title={getName(joint)} />
                                    <FingerIndependence data={metricsData[props.period].FingerIndependence} period={props.period} title={getName(joint)} />
                                    <Dexterity data={metricsData[props.period].Dexterity} period={props.period} title={getName(joint)} />
                                </div>
                            </TabPanel>
                            {/* 2xl:grid-cols-2 */}
                            <TabPanel>
                                <div className="grid grid-cols-1  gap-4">
                                    <Pain data={metricsData[props.period].Pain} period={props.period} title={getName(joint)} />
                                </div>
                            </TabPanel>
                        </Tabs>

                    </>
                )}
            </div>

            {/* Right Side */}
            <div className="relative w-1/3 h-3/4 p-4">
                {/* Timeline */}
                {allDates && allDates.length > 0 && <Chrono items={allDates} mode="HORIZONTAL" />}
                <button
                    className="absolute top-2 left-2 rounded-full bg-blue-500 text-white p-2"
                    onClick={() => sendUserStateandExerciseToVue()}
                >
                    Synchronize Color
                </button>
                <Legend />

                <iframe
                    ref={iframeRef}
                    src="http://localhost:8080/"
                    className="w-full h-3/4 m-2"
                />
                <FlExAdAbButton
                    selectedRotateDirection={selectedRotateDirection}
                    setSelectedRotateDirection={setSelectedRotateDirection}
                    setHasAdAb={setHasAdAb}
                    sendSelectedRotateDirection={(value) => sendSelectedRotateDirection(value)}
                />
                <button onClick={
                    // reloadIframe
                    backToNatureGesture
                } className="p-2 bg-blue-500 text-white rounded-full flex items-center gap-2 absolute bottom-1/4 right-0 ">
                    <TfiHandOpen /> {/* Icon before the text */}

                    Back to Hand Mode
                </button>

            </div>


        </div>


    )
}

export default Hand


const Legend = () =>
{
    return (

        <div className='flex flex-col w-20 absolute top-0 right-1 '>
            <div className='flex w-full' >
                <div className='bg-red-600 text-white p-1 m-1 w-full text-center text-sm' >Serious</div></div>
            <div className='flex w-full '>
                <div className='bg-yellow-600 text-white p-1 m-1 w-full  text-center text-sm'>Medium </div>
            </div>
            <div className='flex w-full '><div className='bg-green-600 text-white p-1 m-1 w-full  text-center text-sm'>Light</div>
            </div>
        </div>
    );
}
const fingerName: { [key: string]: string } = {
    '1': 'Thumb',
    '2': 'Index Finger',
    '3': 'Middle Finger',
    '4': 'Ring Finger',
    '5': 'Pinky'
}

const FlExAdAbButton = (props: {
    selectedRotateDirection: 'FE' | 'DB',
    setSelectedRotateDirection: (value: 'FE' | 'DB') => void,
    setHasAdAb: (value: boolean) => void,
    sendSelectedRotateDirection: (value: 'FE' | 'DB') => void,
}) =>
{
    return (
        <div className='flex flex-col justify-center  '>
            <button
                onClick={() =>
                {
                    props.setSelectedRotateDirection('FE')
                    props.sendSelectedRotateDirection('FE')
                    props.setHasAdAb(false)
                }}
                className={`w-full  p-1 rounded-full text-black m-1 text-center ${props.selectedRotateDirection === 'FE' ? 'bg-slate-300' : 'bg-transparent'}`}>Flexion/Extension</button>
            <button
                onClick={() =>
                {
                    props.setSelectedRotateDirection('DB')
                    props.sendSelectedRotateDirection('DB')
                    props.setHasAdAb(true)
                }}
                className={`w-full  p-1 rounded-full text-black m-1 text-center ${props.selectedRotateDirection === 'DB' ? 'bg-slate-300' : 'bg-transparent'}`}>Adduction/Abduction</button>
        </div>
    )
}