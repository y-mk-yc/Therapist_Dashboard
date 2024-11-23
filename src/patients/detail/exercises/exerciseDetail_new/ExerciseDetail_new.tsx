import {IconInCircle} from '../../../../common/IconInCircle'
import {
    AiFillApple,
    AiFillPauseCircle,
    AiFillPlayCircle,
    AiOutlineBook,
    AiOutlineEdit,
    AiTwotoneEdit
} from 'react-icons/ai'
import {IoBody} from "react-icons/io5";
import React, {ReactNode} from 'react'
import {useGetPatientsByPatientIdExerciseSessionsAndExerciseSessionIdQuery} from "../../../../store/rehybApi";
import {useParams} from "react-router-dom";
import {Loader} from "../../../../common/Loader";
import {getDateString, getDifferenceInMinutes, parseDateOrToday, shortTimeStr} from "../../../../common/dateUtils";
import {SimplePlotlyLineGraph} from "../../../../common/graphs/SimplePlotlyLineGraph";
import {GiBiceps} from "react-icons/gi";


import {sessionData} from './TestData/ExampleResponseStructure_test_ts';
import {SessionData} from './DataStructure';
import {CustomPlot} from './components/CustomPlot';
import {useEffect, useState, useRef, useMemo} from 'react';
import {PlotData, ScatterData, Layout} from 'plotly.js';
import {DetailProgressBar} from './components/DetailProgressBar';
import {NewAvatar} from './components/NewAvatar';


import {FiThumbsUp, FiThumbsDown, FiStopCircle} from "react-icons/fi";
import {AiTwotonePlayCircle, AiTwotonePauseCircle, AiOutlineUndo} from "react-icons/ai";
import {newSessionData} from './TestData/ExampleResponse_New';
import {NewSessionData} from './NewDataStructure';
import { current } from '@reduxjs/toolkit';


interface ExerciseDetail_newProps {
    sessionInfo: NewSessionData;
    setShowLabelingPage: React.Dispatch<React.SetStateAction<boolean>>;
}

function formatDate(date: Date) {
    let day = date.getDate();
    let month = date.getMonth() + 1; 
    let hours = date.getHours(); 
    let minutes = date.getMinutes(); 
    let seconds = date.getSeconds(); 
    let milliseconds = date.getMilliseconds(); 

    function padZero(num: number) {
        return num < 10 ? '0' + num : num;
    }

    return `${padZero(day)}/${padZero(month)} ${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}.${milliseconds}`;
}


export const ExerciseDetail_new: React.FC<ExerciseDetail_newProps> = ({sessionInfo, setShowLabelingPage}) => {

    const [currentMovementIndex, setCurrentMovementIndex] = useState<number>(0);
    const [playing, setPlaying] = useState<boolean>(false);

    const [initialCover, setInitialCover] = useState(true);
    const [coverPosition, setCoverPosition] = useState(0);


    const intervalRef = useRef<NodeJS.Timeout | null>(null); 
    const avatarRef = useRef<HTMLDivElement>(null); 


    const figure_width = 600;
    const leftMargin = 40;
    const rightMargin = 30;
    const topMargin = 40;
    const bottomMargin = 20;

    const togglePlay = () => {
        setPlaying(!playing);
        setInitialCover(false);
    };


    const switchPage = () => {
        setShowLabelingPage(true);
    };


    const {jointData, fatigueData, compensationData, commonLayout, movements_TValues} = useMemo(() => {
        const movements_TValues = sessionInfo.Movements.map(m => m.t); 
        const compensation_TValues = sessionInfo.Compensation.map(comp => [comp.t_start, comp.t_end]).flat();
        const fatigue_TValues = sessionInfo.Fatigue.map(f => f.t);

        const commonXAxisRange = [
            Math.min(...movements_TValues, ...compensation_TValues, ...fatigue_TValues),
            Math.max(...movements_TValues, ...compensation_TValues, ...fatigue_TValues)
        ];

        const commonLayout: Partial<Layout> = {
            xaxis: {
                title: 'Time',
                type: 'date',
                tickformat: '%d/%m %H:%M:%S.%L',
                range: commonXAxisRange,
                showticklabels: false,
            },
            yaxis: {
                title: 'Values',
            },
            hovermode: 'closest' as const,
            autosize: false,
            width: figure_width,
            height: 180,
            margin: {l: leftMargin, r: rightMargin, t: topMargin, b: bottomMargin},
            showlegend: true,
            legend: {
                x: 1,
                y: 1,
                xanchor: 'right',
                yanchor: 'top',
                bgcolor: 'rgba(255,255,255,0)',
                bordercolor: 'rgba(255,255,255,0)',
            },
        };

        const jointData: Partial<PlotData>[] = [
            {
                x: movements_TValues,
                y: sessionInfo.Movements.map(m => parseFloat(m.SFE.toFixed(2))),
                type: 'scatter',
                mode: 'lines+markers',
                name: 'SFE',
                marker: {size: 4},
                hovertemplate: `Time: %{x}<br>Value: %{y}°`
            },
            {
                x: movements_TValues,
                y: sessionInfo.Movements.map(m => parseFloat(m.SHFE.toFixed(2))),
                type: 'scatter',
                mode: 'lines+markers',
                name: 'SHFE',
                marker: {size: 4},
                hovertemplate: `Time: %{x}<br>Value: %{y}°`
            },
            {
                x: movements_TValues,
                y: sessionInfo.Movements.map(m => parseFloat(m.SIE.toFixed(2))),
                type: 'scatter',
                mode: 'lines+markers',
                name: 'SIE',
                marker: {size: 4},
                hovertemplate: `Time: %{x}<br>Value: %{y}°`
            },
            {
                x: movements_TValues,
                y: sessionInfo.Movements.map(m => parseFloat(m.EFE.toFixed(2))),
                type: 'scatter',
                mode: 'lines+markers',
                name: 'EFE',
                marker: {size: 4},
                hovertemplate: `Time: %{x}<br>Value: %{y}°`
            }
        ];

        const fatigueData: Partial<PlotData>[] = [{
            x: sessionInfo.Fatigue.map(f => f.t),
            y: sessionInfo.Fatigue.map(f => f.value),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Fatigue',
            marker: {size: 4},
            hovertemplate: `Time: %{x}<br>Value: %{y}`
        }];

        const compensationData: Partial<PlotData>[] = [{
            x: movements_TValues,
            y: movements_TValues.map(t => {
                const compensation = sessionInfo.Compensation.find(comp => t >= comp.t_start && t <= comp.t_end);
                if(!compensation) return "No";
                else{
                    const labels = compensation.Label;
                    return labels.includes("Healthy") ? "No" : "Yes";
                }
            }),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Compensation',
            marker: {size: 4},
            hovertemplate: movements_TValues.map(t => {
                const activeCompensations = sessionInfo.Compensation.filter(comp => t >= comp.t_start && t <= comp.t_end);
                let text;

                if (activeCompensations.length > 2) {
                    text = activeCompensations.slice(0, 2).map(comp => `x: ${formatDate(new Date(t))}<br>Type: ${comp.Type}<br>Label: ${comp.Label.join(', ')}`).join('<br><br>') + '<br>...';
                } else {
                    text = activeCompensations.map(comp => `x: ${formatDate(new Date(t))}<br>Type: ${comp.Type}<br>Label: ${comp.Label.join(', ')}`).join('<br><br>');
                }

                return text || `x: ${formatDate(new Date(t))}<br>No Label`;
            })
        }];

        return {jointData, fatigueData, compensationData, commonLayout, movements_TValues};
    }, [sessionInfo]);


    const currentTime = useMemo(() => {
        return movements_TValues[currentMovementIndex];
    }, [currentMovementIndex, movements_TValues]);


    useEffect(() => {
        if (playing) {
            const nextIndex = currentMovementIndex + 1;
                        
            // If we have reached the end of the movements array, stop and reset
            if (nextIndex >= movements_TValues.length) {
                restart();
                return;
            }
    
            const currentTime = new Date(movements_TValues[currentMovementIndex]).getTime();
            const nextTime = new Date(movements_TValues[nextIndex]).getTime();
            const timeDifference = nextTime - currentTime;
    
            intervalRef.current = setTimeout(() => {
                setCurrentMovementIndex(nextIndex);  // Update the index
            }, timeDifference);
    
        } else if (!playing && intervalRef.current) {
            clearTimeout(intervalRef.current);  // Stop the interval if not playing
        }
    
        return () => {
            if (intervalRef.current) {
                clearTimeout(intervalRef.current);  // Clean up on unmount or playback change
            }
        };
    }, [playing, currentMovementIndex, movements_TValues]);  // Add currentMovementIndex as a dependency    

    useEffect(() => {
        if (!initialCover) {
            if (movements_TValues.length > 1) {
                const newPosition = (currentMovementIndex / (movements_TValues.length - 1)) * 100;
                setCoverPosition(newPosition);
            } else {
                setCoverPosition(0);
            }
        }
    }, [currentMovementIndex, initialCover, movements_TValues]);


    const restart = () => {
        if (intervalRef.current) {
            clearTimeout(intervalRef.current); // Clear any running intervals first
            intervalRef.current = null;
        }
        setPlaying(false); // Set playing to false before any other operations
        setInitialCover(true); // Show the cover page again
        setCurrentMovementIndex(0); // Reset the movement index to 0
        setCoverPosition(0); // Reset the progress bar to the start
    };    

    const getStatusClassName = (status: string) => {
        switch (status) {
            case 'Finished':
                return 'text-green-600 font-bold';
            case 'Unfinished':
                return 'text-orange-600 font-bold';
            case 'Skipped':
                return 'text-red-600 font-bold';
            case 'Planned':
                return 'text-black font-bold';
            default:
                return 'text-gray-600 font-bold';
        }
    };

    const shouldDisplayAvatarSection = (sessionInfo.Status === 'Finished' || sessionInfo.Status === 'Unfinished') && movements_TValues.length > 0;


    const getDateString = (day: Date | string): string => {
        const date = new Date(day);
        return date.toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'});
    };

    const getTimeString = (day: Date | string): string => {
        const date = new Date(day);
        return date.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'});
    };

    const formatKeyName = (key: string): string => {
        const nameMappings: { [key: string]: string } = {
            ROM: 'Range of Motion',
            Strength: 'Strength',
            Endurance: 'Endurance',
            ElbowFE: 'Elbow flexion/extension',
            ShoulderFE: 'Shoulder flexion/extension',
            ShoulderIE: 'Shoulder internal/external rotation',
            ShoulderAA: 'Shoulder abduction/adduction',
            WristPS: 'Wrist pronation/supination',
        };
        return nameMappings[key] || key;
    };

    return (
        <div className='flex flex-col gap-4'>
            <h4 className='leading-none'>Session Nr. {sessionInfo.SessionID}</h4>
            <div className='flex gap-4 flex-wrap'>
                <div className={'flex flex-col gap-4 flex-[4]'}>
                    <div className={'flex gap-4 flex-wrap'}>
                        <div className='flex flex-col gap-4 flex-1 min-w-[200px]'>
                            <div className='flex gap-4 items-end'>
                                <IconInCircle icon={<GiBiceps/>} size={5}/>
                                <h2>{sessionInfo.ProtocolName}</h2>
                            </div>
                            <div className='flex flex-col gap-2 h-52'>
                                <h3 className="text-lg font-bold mb-2">Description:</h3>
                                <span className='text-lg align-middle'>{sessionInfo.ProtocolDescription}</span>
                            </div>
                        </div>
                        <img className=' flex h-40 flex-1' src={sessionInfo.Thumbnail}/>
                    </div>

                    <div className="mt-10 h-64">
                        <h3 className="text-lg font-bold mb-2">Therapy Focus:</h3>
                        <div className='flex'>
                            {(() => {
                                const filteredFocuses = Object.entries(sessionInfo.TherapyFocus)
                                    .filter(([, value]) => value)
                                    .map(([key]) => formatKeyName(key));

                                return (
                                    <>
                                        <ul className="list-disc pl-5 flex-1">
                                            {filteredFocuses.slice(0, 4).map((focus) => (
                                                <li key={focus}>{focus}</li>
                                            ))}
                                        </ul>
                                        {filteredFocuses.length > 4 && (
                                            <ul className="list-disc pl-5 flex-1">
                                                {filteredFocuses.slice(4, 8).map((focus) => (
                                                    <li key={focus}>{focus}</li>
                                                ))}
                                            </ul>
                                        )}
                                        {filteredFocuses.length > 8 && (
                                            <ul className="list-disc pl-5 flex-1">
                                                {filteredFocuses.slice(8, 12).map((focus) => (
                                                    <li key={focus}>{focus}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>

                    <div className={'flex flex-col border rounded-xl overflow-hidden mt-5'}>
                        <div className='flex flex-col p-3 bg-white items-center gap-1 border-b'>
                            <span className={'font-bold'}>Status</span>
                            <span className={getStatusClassName(sessionInfo.Status)}>
                                {sessionInfo.Status}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-stretch bg-white">
                            {
                                [
                                    {
                                        id: 'Date',
                                        title: 'Date',
                                        value: <div className={'flex flex-col items-center'}>
                                            <span>{getDateString(sessionInfo.Date)}</span>
                                            <span>{getTimeString(sessionInfo.Date)}</span>
                                        </div>
                                    },
                                    {
                                        id: 'Duration',
                                        title: 'Duration',
                                        value: shouldDisplayAvatarSection ? `${parseFloat(sessionInfo.Duration.toFixed(1))} mins` : '--'
                                    },
                                    {
                                        id: 'Score',
                                        title: 'Score',
                                        value: shouldDisplayAvatarSection ?
                                            <div className={'flex flex-col items-center'}>
                                                <span>{Math.round(sessionInfo.Score * 100)}%</span>
                                                <span className={'text-sm'}>{`(Highest: ${Math.round(sessionInfo.HighScore * 100)}%)`}</span>
                                            </div>
                                            : '--'
                                    },
                                    {
                                        id: 'Protocol Rating',
                                        title: <div className={'flex flex-col items-center'}>
                                            <span>Protocol Rating</span>
                                        </div>,
                                        value: shouldDisplayAvatarSection ?
                                            <div className={'flex flex-col items-center'}>
                                                <div>
                                                    {sessionInfo.Rating === "Like" ? (
                                                        <FiThumbsUp style={{fill: 'rgba(72, 187, 120, 0.6)'}}/>
                                                    ) : (
                                                        <FiThumbsDown style={{fill: 'rgba(239, 68, 68, 0.6)'}}/>
                                                    )}
                                                </div>
                                                <span className={'text-sm'}>{`Overall : ${Math.round(sessionInfo.OverallRating * 100)}%`}</span>
                                            </div>
                                            : '--'
                                    },
                                ].map((stat, index) => (
                                    <div key={stat.id}
                                         className={`flex flex-col flex-grow basis-1/2 ${index % 2 === 0 ? 'border-r' : ''} ${index <= 1 ? 'border-b' : ''}`}>
                                        <StatsBox title={stat.title} value={stat.value}/>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                {!shouldDisplayAvatarSection ? (
                    <div className='flex justify-center items-center bg-black bg-opacity-50 flex-[2]'>
                        <span className='text-white text-xl'>No data available</span>
                    </div>
                ) : (
                    <div className='flex flex-col gap-4 flex-[2]'>
                        <div ref={avatarRef} className='h-80'>
                            {initialCover ? (
                                <div className='flex h-80 justify-center items-center bg-black bg-opacity-50 rounded-lg'>
                                    <span className='text-white text-xl'>Click 'Play' to show</span>
                                </div>
                            ) : (
                                <NewAvatar
                                    data={sessionInfo.Movements}
                                    currentFrame={currentMovementIndex}
                                    parentRef={avatarRef}
                                />
                            )}
                        </div>

                        <div className="text-sm text-gray-800">
                            {`Current Time: ${formatDate(new Date(currentTime))}`}
                        </div>

                        <div className='flex flex-row items-center'>
                            <DetailProgressBar
                                currentMovementIndex={currentMovementIndex}
                                movements_TValues={movements_TValues}
                                width={figure_width - rightMargin - leftMargin}
                                left={leftMargin}
                            />
                            <div className='flex ml-3'>
                                <div className="bg-gray-700 rounded-full">
                                    {playing ?
                                        <AiFillPauseCircle size={24} onClick={togglePlay} style={{cursor: 'pointer'}}/> :
                                        <AiFillPlayCircle size={24} onClick={togglePlay} style={{cursor: 'pointer'}}
                                        />}
                                </div>
                                <div className='rounded-full bg-gray-700 ml-2'>
                                    <FiStopCircle size={24} onClick={restart} style={{cursor: 'pointer'}}/>
                                </div>
                            </div>
                        </div>

                        <div className='relative flex flex-col'>
                            <CustomPlot title="Joint Movements Analysis" data={jointData}
                                        layout={{
                                            ...commonLayout,
                                            yaxis: {
                                                title: 'Angle (°)',
                                            }
                                        }}
                                        showCover={!initialCover} coverPosition={coverPosition} coverLeft={leftMargin}
                                        coverWidth={figure_width - rightMargin - leftMargin}/>
                            <CustomPlot title="Fatigue Monitoring" data={fatigueData}
                                        layout={{
                                            ...commonLayout,
                                            yaxis: {
                                                title: 'Fatigue Level',
                                                range: [0, 1]
                                            }
                                        }}
                                        showCover={!initialCover} coverPosition={coverPosition} coverLeft={leftMargin}
                                        coverWidth={figure_width - rightMargin - leftMargin}/>

                            <div className='relative'>
                                <CustomPlot title="Movement Compensation Analysis" data={compensationData}
                                            layout={{
                                                ...commonLayout,
                                                yaxis: {
                                                    title: 'Compensation',
                                                }
                                            }}
                                            showCover={!initialCover} coverPosition={coverPosition}
                                            coverLeft={leftMargin} coverWidth={figure_width - rightMargin - leftMargin}/>

                                <div className="absolute bottom-12 right-3 bg-gray-500 rounded-sm">
                                    <AiTwotoneEdit size={24} style={{cursor: 'pointer'}} onClick={switchPage}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatsBox = (props: { title: ReactNode, value: ReactNode }) => {
    return <div className='flex flex-1 flex-col p-3 bg-white items-center gap-1'>
        <span className={'font-bold'}>{props.title}</span>
        <span>{props.value}</span>
    </div>;
}
