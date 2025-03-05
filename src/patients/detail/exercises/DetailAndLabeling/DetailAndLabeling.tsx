import React, {useState,useEffect} from 'react';
import {ExerciseDetail_new} from '../exerciseDetail_new/ExerciseDetail_new';
import {ExerciseLabeling} from '../Labeling/Labeling';
import {newSessionData} from '../exerciseDetail_new/TestData/ExampleResponse_New';
import {useGetExerciseSessionDetailQuery} from "../../../../store/rehybApi";
import {useParams} from "react-router-dom";
import {NewSessionData} from "../exerciseDetail_new/NewDataStructure";

export const DetailAndLabeling = (props: { sessionId: string }) => {
    //调用后端接口获取数据
    const {patientId} = useParams();
    const {data: sessionData, error, isLoading} = useGetExerciseSessionDetailQuery({
        PatientID: patientId!,
        SessionID: props.sessionId
    });
    // console.log("sessioionData from back end", sessionData);



    const [showLabelingPage, setShowLabelingPage] = useState<boolean>(false);


    // const [sessionInfo, setSessionInfo] = useState(newSessionData);

    if(isLoading)  return <div>Loading...</div>;
    if(error||!sessionData) return <div>Error: no data</div>;

    // 这里手动删除第一个数据点因为第一个数据点和第二个数据点之间的时间差异常的大，Martin说可能是Exoskeleton设备和脚本的问题
    const {Movements,...rest} = sessionData as NewSessionData;
    const newMovements = Movements.slice(1);
    const newSessionData = {...rest,Movements:newMovements};

    return (
        <>
            {showLabelingPage ? (
                <ExerciseLabeling
                    sessionInfo={newSessionData}
                    // setSessionInfo={setSessionInfo}
                    setShowLabelingPage={setShowLabelingPage}
                />
            ) : (
                <ExerciseDetail_new
                    sessionInfo={newSessionData}
                    setShowLabelingPage={setShowLabelingPage}
                />
            )}
        </>
    );
};