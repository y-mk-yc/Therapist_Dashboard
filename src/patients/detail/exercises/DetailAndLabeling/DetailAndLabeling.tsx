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
    console.log("sessioionData from back end", sessionData);



    const [showLabelingPage, setShowLabelingPage] = useState<boolean>(false);


    // const [sessionInfo, setSessionInfo] = useState(newSessionData);

    if(isLoading)  return <div>Loading...</div>;
    if(error||!sessionData) return <div>Error: no data</div>;


    return (
        <>
            {showLabelingPage ? (
                <ExerciseLabeling
                    sessionInfo={sessionData}
                    // setSessionInfo={setSessionInfo}
                    setShowLabelingPage={setShowLabelingPage}
                />
            ) : (
                <ExerciseDetail_new
                    sessionInfo={sessionData}
                    setShowLabelingPage={setShowLabelingPage}
                />
            )}
        </>
    );
};