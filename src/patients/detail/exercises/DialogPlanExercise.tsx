import React, {FC, useEffect, useState} from "react";
import {useAppSelector} from "../../../store/store";
import {Dialog} from "../../../common/dialogs/Dialog";
import {LabeledRange, LabeledSelect, LabeledTimeInputWithSelect} from "../../../common/Inputs";
import {LoggedInUser} from "../../../store/slices/userSlice";
import {
    EditablePrescription, OnlineVariableSession, Prescription,
} from "../../../store/rehybApi";
import dayjs from "dayjs";
import {getDateString} from "../../../common/dateUtils";
import {isEditablePrescription} from "./Exercises";


export const DialogPlanExercise = (props: {
    onDone: () => void,
    day: Date,
    prescriptionID: string,
    setExercisesAndPrescriptions: (value: Record<string, (OnlineVariableSession | Prescription | EditablePrescription)[]>) => void,
    exercisesAndPrescriptions: Record<string, (OnlineVariableSession | Prescription | EditablePrescription)[]>,
    reeditPrescription?: EditablePrescription //这个是用来编辑的，如果有的话，就是编辑刚拖入且没有save的editablePrescription，没有的话就是新建editablePrescription
    defaultRehybSetup?: string
}) => {
    const [exerciseTime, setExerciseTime] = useState(props.day);
    const [exerciseDuration, setExerciseDuration] = useState(() =>
        props.reeditPrescription ? props.reeditPrescription.Duration : 1
    );
    const [difficulty, setDifficulty] = useState(() =>
        props.reeditPrescription ? props.reeditPrescription.Difficulty : 0
    );
    const [rehybSetting, setRehybSetting] = useState(() =>
        props.reeditPrescription ? props.reeditPrescription.ReHybSetup : (props.defaultRehybSetup ? props.defaultRehybSetup : "DTU-Setup")
    );
    const isInClinic = useAppSelector(store => (store.userReducer.user as LoggedInUser).settings.viewType) == 'IN_CLINIC';
    //可以根据Date字符串后面加一些东西来区分exercise的时间有没有设置好，以此来判断是isInClinc还是isAtHome创建的exercise


    const onCreate = () => {
        const editablePrescription =
            {
                ...(props.exercisesAndPrescriptions[getDateString(props.day)].find((item) =>
                    isEditablePrescription(item) && item.PrescriptionID === props.prescriptionID
                ) as EditablePrescription)
            };
        editablePrescription.Date = exerciseTime.toISOString();
        editablePrescription.Duration = exerciseDuration;
        editablePrescription.Difficulty = difficulty;
        editablePrescription.ReHybSetup = rehybSetting;

        // PrescriptionID: string;
        // Date: string;
        // PatientID: string;
        // ProtocolID: string;
        // SessionID: string; 这个在这里暂时没有，因为是在后端生成的
        // Duration: number;
        // Difficulty: number;
        // ReHybSetup: string;
        // Editable: boolean;

        const newExercisesAndPrescriptions = {...props.exercisesAndPrescriptions};
        //去除原来的，加入新的
        newExercisesAndPrescriptions[getDateString(props.day)] = newExercisesAndPrescriptions[getDateString(props.day)].filter((item) =>
            !isEditablePrescription(item) || item.PrescriptionID !== props.prescriptionID
        );
        newExercisesAndPrescriptions[getDateString(props.day)].push(editablePrescription);

        props.setExercisesAndPrescriptions(newExercisesAndPrescriptions);
        props.onDone();
    }


    useEffect(() => {  //如果是atHome模式，就设置为当天的开始
        if (!isInClinic) {
            const day = props.day;
            //设置为一天的开始
            day.setHours(0, 0, 0, 0);
            setExerciseTime(day);
        }
    }, [isInClinic]);

    const createDisabled = isInClinic ? dayjs(exerciseTime).isBefore(dayjs()) : false;
    const timeError = createDisabled ? "Time cannot be in the past" : "";
    // console.log(`isinClinic: ${isInClinic}`);

    return <Dialog onClose={() => {
        if (!props.reeditPrescription) {
            const newExercisesAndPrescriptions = {...props.exercisesAndPrescriptions};
            newExercisesAndPrescriptions[getDateString(props.day)] = newExercisesAndPrescriptions[getDateString(props.day)].filter((item) =>
                !isEditablePrescription(item) || item.PrescriptionID !== props.prescriptionID
            );
            props.setExercisesAndPrescriptions(newExercisesAndPrescriptions);
        }
        props.onDone();
    }} className={'w-80'}>

        <div className={'flex flex-col gap-4'}>
            <h3>Schedule exercise</h3>
            {isInClinic && <LabeledTimeInputWithSelect
                label={'Time'}
                value={exerciseTime}
                onValueSet={setExerciseTime}
                error={timeError}
            />}
            <LabeledRange
                label={'Duration'}
                min={1}
                max={60}
                step1={1}
                value={exerciseDuration}
                onChanged={setExerciseDuration} unit={'minutes'}
            />
            <LabeledRange
                label={'Game difficulty'}
                min={0}
                max={1}
                step1={0.1}
                step2={0.1}
                value={difficulty}
                onChanged={setDifficulty} unit={''}
            />
            {/*<LabeledSelect*/}
            {/*    label={'ReHyb setup'}*/}
            {/*    placeholder={""}*/}
            {/*    onValueSet={setRehybSetting}*/}
            {/*    value={rehybSetting}*/}
            {/*    values={[{value: "DTU-Setup", text: "DTU-Setup"},*/}
            {/*        {value: "HP-1", text: "HP-1"},*/}
            {/*        {value: "HP-2", text: "HP-2"},*/}
            {/*        {value: "SL", text: "SL"}]}*/}
            {/*/>*/}
            <button className={'btn-primary self-center mt-4'} onClick={onCreate} disabled={createDisabled}>Create
            </button>
        </div>
    </Dialog>
}