import { useEffect, useState, useReducer, useCallback } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { useParams } from "react-router-dom";
import
{
    StateVariable,
    useGetPatientsByPatientIdDataQuery,
    useGetUsermodelByPatientIdQuery,
    useUpdateTherapyGoalsByPatientIdMutation
} from "../../../store/rehybApi";
import { Loader } from "../../../common/Loader";
import { SideDialog } from '../../../common/dialogs/SideDialog';
import { divWrapper } from "../../../common/styleUtils";
import { LabeledMinMaxInput, LabeledNumberInput } from "../../../common/Inputs";
import { getLatestObject } from "../../../common/utils";
import Collapsible from 'react-collapsible';
import { MilestoneClass, useGetHandUsermodelByPatientIdQuery, usePutPatientsHandMutation, UserState } from '../../../store/dataApi';


type ROMState = {
    AngleShoulderAA: { Min: number; Max: number };
    AngleShoulderFE: { Min: number; Max: number };
    AngleShoulderIE: { Min: number; Max: number };
    AngleShoulderHFE: { Min: number; Max: number };
    AngleElbowFE: { Min: number; Max: number };
    AngleWristPS: { Min: number; Max: number };
    AngleIndexFE: { Min: number; Max: number };
};

type SpasticityState = {
    ShoulderAA: number;
    ShoulderFE: number;
    ShoulderHFE: number;
    ShoulderIE: number;
    Elbow: number;
    // Wrist: number;
    Hand: number;
};

type EnduranceState = {
    Shoulder: number;
    Elbow: number;
    // Wrist: number; //therapyGoals的Endurance中暂时没有Wrist
    Hand: number;
};

type StrengthState = {
    RequiredSupportShoulderAA: number;
    RequiredSupportShoulderFE: number;
    RequiredSupportShoulderHFE: number;
    RequiredSupportShoulderIE: number;
    RequiredSupportElbowFE: number;
    RequiredSupportGrip: number;
}

export type TherapyGoalsState = {
    Description: string;
    ROM: ROMState;
    Strength: StrengthState;
    Spasticity: SpasticityState;
    Endurance: EnduranceState;
};

type TherapyGoalsAction =   //action 可以是任何类型，但是必须有一个type属性，这个属性是用来识别action的
    | { type: 'SET_ROM'; payload: ROMState }
    | { type: 'SET_SPASTICITY'; payload: SpasticityState }
    | { type: 'SET_ENDURANCE'; payload: EnduranceState }
    | { type: 'SET_STRENGTH'; payload: StrengthState }
    | { type: 'SET_DESCRIPTION'; payload: string };

const initialState: TherapyGoalsState = {
    Description: '',
    ROM: {
        AngleShoulderAA: { Min: 0, Max: 0 },
        AngleShoulderFE: { Min: 0, Max: 0 },
        AngleShoulderIE: { Min: 0, Max: 0 },
        AngleShoulderHFE: { Min: 0, Max: 0 },
        AngleElbowFE: { Min: 0, Max: 0 },
        AngleWristPS: { Min: 0, Max: 0 },
        AngleIndexFE: { Min: 0, Max: 0 },
    },
    Strength: {
        RequiredSupportShoulderAA: 0,
        RequiredSupportShoulderFE: 0,
        RequiredSupportShoulderHFE: 0,
        RequiredSupportShoulderIE: 0,
        RequiredSupportElbowFE: 0,
        RequiredSupportGrip: 0,
    },
    Spasticity: {
        ShoulderAA: 0,
        ShoulderFE: 0,
        ShoulderHFE: 0,
        ShoulderIE: 0,
        Elbow: 0,
        // Wrist: 0,
        Hand: 0,
    },
    Endurance: {
        Shoulder: 0,
        Elbow: 0,
        // Wrist: 0,
        Hand: 0,
    },
};

function reducer(state: TherapyGoalsState, action: TherapyGoalsAction): TherapyGoalsState
{
    //每当dispatch一个action时，reducer函数会被调用，传入当前的state和action，然后返回一个新的state，根据action的type来决定如何更改state
    switch (action.type)
    {
        case 'SET_ROM':
            return { ...state, ROM: action.payload };
        case 'SET_SPASTICITY':
            return { ...state, Spasticity: action.payload };
        case 'SET_ENDURANCE':
            return { ...state, Endurance: action.payload };
        case 'SET_STRENGTH':
            return { ...state, Strength: action.payload };
        case "SET_DESCRIPTION":
            return { ...state, Description: action.payload };
        default:
            return state;
    }
}
function getCurrentState_Spasticity(sv: StateVariable | undefined, bodyPart: 'shoulderAA' | 'shoulderFE' | 'shoulderHFE' | 'shoulderIE' | 'elbow' | 'hand')
{
    //设置这个函数的原因是因为数据库中usermodel的goal和stateVariable的数据结构不一样，(需求不清晰累死程序员:))
    const getAverageTorque = (assessments: { Speed: string, Spasticity: { Angle: number, Torque: number }[] }[]): number =>
    {
        const torques = assessments.flatMap(a => a.Spasticity.map(s => s.Torque));
        const totalTorque = torques.reduce((a, b) => a + b, 0);
        console.log({ torques, totalTorque });
        return torques.length > 0 ? totalTorque / torques.length : 0;
    }

    if (sv === undefined) return null;

    const bodyParts = {
        shoulderAA: sv.Physical?.Spasticity?.ShoulderAA,
        shoulderFE: sv.Physical?.Spasticity?.ShoulderFE,
        shoulderHFE: sv.Physical?.Spasticity?.ShoulderHFE,
        shoulderIE: sv.Physical?.Spasticity?.ShoulderIE,
        elbow: sv.Physical?.Spasticity?.ElbowFE,
        hand: sv.Physical?.Spasticity?.Hand
    };

    const bodyPartAssessments = bodyParts[bodyPart];
    if (bodyPartAssessments && bodyPartAssessments.length > 0)
    {
        return +getAverageTorque(getLatestObject(bodyPartAssessments).Assessment).toFixed(2);
    }
    return null;
}


function placeCursorAtEnd(contentEditableElement: HTMLElement)
{
    const range = document.createRange();
    range.selectNodeContents(contentEditableElement);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
}

const Grid = divWrapper('grid grid-cols-[repeat(2,1fr)] grid-rows-[repeat(5,auto)] gap-x-6 gap-y-2');

export const TherapyGoals = () =>
{
    const { patientId } = useParams();
    const {
        data: stateVariable,
        isLoading: isLoadingSV,
    } = useGetPatientsByPatientIdDataQuery({ PatientID: patientId! })
    const {
        data: usermodel,
        isLoading: isLoadingUM,
        isError: isErrorUM
    } = useGetUsermodelByPatientIdQuery({ PatientID: patientId! })

    const {
        data: handUsermodel,
        isLoading: isLoadingHUM,
        isError: isErrorHUM
    } = useGetHandUsermodelByPatientIdQuery({ PatientID: patientId! })

    const [handState, setHandState] = useState<UserState>()
    const [updateHandState] = usePutPatientsHandMutation()
    const [updateTherapyGoals] = useUpdateTherapyGoalsByPatientIdMutation();

    const [state, dispatch] = useReducer(reducer, initialState);
    //注意这里的state是reducer函数返回的state(即UM)，不是对话框中显示的Current State(即SV)
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    // const [isEditingShortTerm, setIsEditingShortTerm] = useState(false);
    const [stateRollback, setStateRollback] = useState(false);

    const [term, setTerm] = useState<('LongTerm' | 'ShortTerm')>('LongTerm');

    let isUpdateDisabled = false;

    const setROM = useCallback((rom: ROMState) =>
    {
        dispatch({ type: 'SET_ROM', payload: rom });
    }, []); //只在组件挂载时执行一次，不需要依赖任何变量，所以传入空数组, useCallback的作用时保存一个函数，避免每次渲染都创建一个新的函数

    const setSpasticity = useCallback((spasticity: SpasticityState) =>
    {
        dispatch({ type: 'SET_SPASTICITY', payload: spasticity });
    }, []);

    const setEndurance = useCallback((endurance: EnduranceState) =>
    {
        dispatch({ type: 'SET_ENDURANCE', payload: endurance });
    }, []);

    const setStrength = useCallback((strength: StrengthState) =>
    {
        dispatch({ type: 'SET_STRENGTH', payload: strength });
    }, []);

    const setDescription = useCallback((description: string) =>
    {
        dispatch({ type: 'SET_DESCRIPTION', payload: description });
    }, []);

    const onUpdate = async () =>
    {
        const result = await updateTherapyGoals({
            PatientID: patientId!,
            Term: term,
            TherapyGoals: state,
        })

        await updateHandState({
            PatientID: patientId!,
            handState: handState!
        })
        if ('error' in result)
        {
            console.error('update failed', result.error);
        }
    }

    useEffect(() =>
    {
        if (usermodel)
        {
            //这里写这么复杂主要是防止数据库中有的数据值为null，这样会导致state中的值为null，然后在渲染时会报错
            const ROM1 = usermodel.TherapyGoals?.[term]?.Quantification?.Physical?.ROM || {};
            const ROM2 = { ...initialState.ROM, ...ROM1 };
            const ROM3 = Object.fromEntries(
                Object.entries(ROM2).map(([key, value]) => [
                    key,
                    {
                        Min: value.Min ?? 0,
                        Max: value.Max ?? 0,
                    },
                ])
            ) as ROMState;
            setROM(ROM3);

            const Spasticity1 = usermodel.TherapyGoals?.[term]?.Quantification?.Physical?.Spasticity || {};
            const Spasticity2 = { ...initialState.Spasticity, ...Spasticity1 };
            const Spasticity3 = Object.fromEntries(
                Object.entries(Spasticity2).map(([key, value]) => [key, value ?? 0])
            ) as SpasticityState;
            setSpasticity(Spasticity3);

            const Endurance1 = usermodel.TherapyGoals?.[term]?.Quantification?.Physical?.Endurance || {};
            const Endurance2 = { ...initialState.Endurance, ...Endurance1 };
            const Endurance3 = Object.fromEntries(
                Object.entries(Endurance2).map(([key, value]) => [key, value ?? 0])
            ) as EnduranceState;
            setEndurance(Endurance3);

            const Strength1 = usermodel.TherapyGoals?.[term]?.Quantification?.Physical?.Strength || {};
            const Strength2 = { ...initialState.Strength, ...Strength1 };
            const Strength3 = Object.fromEntries(
                Object.entries(Strength2).map(([key, value]) => [key, value ?? 0])
            ) as StrengthState;
            setStrength(Strength3);

            setDescription(usermodel.TherapyGoals?.[term]?.Description || '');
        }
    }, [usermodel, setROM, setSpasticity, setEndurance, setStrength, setDescription, stateRollback, term]);

    useEffect(() =>
    {
        console.log('set hand state')
        setHandState(handUsermodel!)
    }, [handUsermodel])
    //这里要设置UM的goal为空的情况
    if (isLoadingSV || isLoadingUM || isLoadingHUM) return <Loader />
    if (isErrorUM || !usermodel)
        return <div className={`flex-col`}>
            <h3 className="whitespace-nowrap">Therapy goals</h3>
            <p>Error in loading the data of User Model</p>
        </div>

    for (let key in state.ROM)
    {
        if (state.ROM.hasOwnProperty(key))
        {
            const angle = state.ROM[key as keyof ROMState];
            // 检查Min是否大于等于Max
            if (angle.Min > angle.Max)
            {
                isUpdateDisabled = true;
                break;
            }
        }
    }

    // console.log("state", state);
    console.log({ handState })
    return <>
        <h3 className="whitespace-nowrap">Therapy goals</h3>
        <div className="flex flex-col gap-2 justify-center mt-6">
            <Goals
                key="long-term"
                title="Long term goal"
                goal={usermodel.TherapyGoals?.LongTerm?.Description || 'No long term goal defined'}
                onEdit={() =>
                {
                    setTerm('LongTerm');
                    setIsEditingGoal(true);
                }}
            />
            <Goals
                key="short-term"
                title="Short term goal"
                goal={usermodel.TherapyGoals?.ShortTerm?.Description || 'No short term goal defined'}
                onEdit={() =>
                {
                    setTerm('ShortTerm');
                    setIsEditingGoal(true);
                }}
            />
        </div>
        {isEditingGoal &&
            <SideDialog
                title={term === 'LongTerm' ? "Long Term Goal" : "Short Term Goal"}
                subtitle={term === 'LongTerm' ? 'Edit the long term goal for the patient' : 'Edit the short term goal for the patient'}
                onClose={() =>
                {
                    setIsEditingGoal(false);
                    setStateRollback(!stateRollback);
                }}
                showCancelButton={true}
                actionLabel="Update"
                primaryAction={() =>
                {
                    onUpdate();
                    setIsEditingGoal(false);
                }}
                isActionDisabled={isUpdateDisabled}
            >
                <>
                    <div className={`card-outline mb-4 `}>
                        <h5 className="mb-2">Description</h5>
                        <div className={`w-[500px] rounded px-6 py-4 border border-gray-300 font-semibold`}
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onInput={(e) =>
                            {
                                setDescription(e.currentTarget.textContent || '');
                                placeCursorAtEnd(e.currentTarget);
                            }}>
                            {state.Description}
                        </div>
                    </div>


                    <Collapsible trigger="Hands" triggerStyle={{ fontSize: 20, fontWeight: 'bold' }}>
                        <Grid>
                            {
                                handState?.Milestone && Object.keys(handState.Milestone).map((side: string) =>
                                {
                                    console.log({ handState })
                                    if (!handState.AffectedHand.includes(side)) return null
                                    const sideData = handState.Milestone[side as keyof typeof handState.Milestone];
                                    return Object.keys(sideData).map((joint: string) =>
                                    {
                                        const jointData = sideData[joint as keyof typeof sideData] as any;

                                        if (jointData?.Yrotation && jointData?.Xrotation && jointData?.Zrotation)
                                        {
                                            // console.log({ joint, jointData })
                                            return (
                                                <div key={`${side}-${joint}`} className='border border-slate-400 p-5'>
                                                    <LabeledMinMaxInput
                                                        label={`${joint} Y Rotation`}
                                                        minValue={jointData.Yrotation.min}
                                                        maxValue={jointData.Yrotation.max}
                                                        currentState={jointData.Yrotation}
                                                        onMinValueSet={(value: number) =>
                                                        {
                                                            const updateMinValue: UserState = {
                                                                ...handState,
                                                                Milestone: {
                                                                    ...handState!.Milestone,
                                                                    [side as keyof MilestoneClass]: {
                                                                        ...handState!.Milestone[side as keyof MilestoneClass],
                                                                        [joint]: {
                                                                            ...jointData,
                                                                            Yrotation: {
                                                                                max: jointData.Yrotation.max,
                                                                                min: value
                                                                            }

                                                                        }
                                                                    }
                                                                }

                                                            }
                                                            setHandState(updateMinValue)

                                                        }}

                                                        onMaxValueSet={(value: number) =>
                                                        {
                                                            const updateMinValue: UserState = {
                                                                ...handState,
                                                                Milestone: {
                                                                    ...handState!.Milestone,
                                                                    [side as keyof MilestoneClass]: {
                                                                        ...handState!.Milestone[side as keyof MilestoneClass],
                                                                        [joint]: {
                                                                            ...jointData,
                                                                            Yrotation: {
                                                                                min: jointData.Yrotation.min,
                                                                                max: value
                                                                            }

                                                                        }
                                                                    }
                                                                }

                                                            }
                                                            setHandState(updateMinValue)

                                                        }
                                                        }
                                                    />
                                                    <LabeledMinMaxInput
                                                        label={`${joint} X Rotation`}
                                                        minValue={jointData.Xrotation.min}
                                                        maxValue={jointData.Xrotation.max}
                                                        currentState={jointData.Xrotation}
                                                        onMinValueSet={(value: number) =>
                                                        {
                                                            const updateMinValue: UserState = {
                                                                ...handState,
                                                                Milestone: {
                                                                    ...handState!.Milestone,
                                                                    [side as keyof MilestoneClass]: {
                                                                        ...handState!.Milestone[side as keyof MilestoneClass],
                                                                        [joint]: {
                                                                            ...jointData,
                                                                            Xrotation: {
                                                                                max: jointData.Xrotation.max,
                                                                                min: value
                                                                            }

                                                                        }
                                                                    }
                                                                }

                                                            }
                                                            setHandState(updateMinValue)

                                                        }}

                                                        onMaxValueSet={(value: number) =>
                                                        {
                                                            const updateMinValue: UserState = {
                                                                ...handState,
                                                                Milestone: {
                                                                    ...handState!.Milestone,
                                                                    [side as keyof MilestoneClass]: {
                                                                        ...handState!.Milestone[side as keyof MilestoneClass],
                                                                        [joint]: {
                                                                            ...jointData,
                                                                            Xrotation: {
                                                                                min: jointData.Xrotation.min,
                                                                                max: value
                                                                            }

                                                                        }
                                                                    }
                                                                }

                                                            }
                                                            setHandState(updateMinValue)

                                                        }}
                                                    />
                                                    <LabeledMinMaxInput
                                                        label={`${joint} Z Rotation`}
                                                        minValue={jointData.Zrotation.min}
                                                        maxValue={jointData.Zrotation.max}
                                                        currentState={jointData.Zrotation}
                                                        onMinValueSet={(value: number) =>
                                                        {
                                                            const updateMinValue: UserState = {
                                                                ...handState,
                                                                Milestone: {
                                                                    ...handState!.Milestone,
                                                                    [side as keyof MilestoneClass]: {
                                                                        ...handState!.Milestone[side as keyof MilestoneClass],
                                                                        [joint]: {
                                                                            ...jointData,
                                                                            Zrotation: {
                                                                                max: jointData.Zrotation.max,
                                                                                min: value
                                                                            }

                                                                        }
                                                                    }
                                                                }

                                                            }
                                                            setHandState(updateMinValue)

                                                        }}

                                                        onMaxValueSet={(value: number) =>
                                                        {
                                                            const updateMinValue: UserState = {
                                                                ...handState,
                                                                Milestone: {
                                                                    ...handState!.Milestone,
                                                                    [side as keyof MilestoneClass]: {
                                                                        ...handState!.Milestone[side as keyof MilestoneClass],
                                                                        [joint]: {
                                                                            ...jointData,
                                                                            Zrotation: {
                                                                                min: jointData.Zrotation.min,
                                                                                max: value
                                                                            }

                                                                        }
                                                                    }
                                                                }

                                                            }
                                                            setHandState(updateMinValue)

                                                        }}
                                                    />
                                                </div>
                                            );
                                        }

                                        return null;
                                    });

                                })
                            }
                        </Grid>

                    </Collapsible>
                    <br></br>

                    <Collapsible trigger="Physical" triggerStyle={{ fontSize: 20, fontWeight: 'bold' }}> <div className="card-outline">
                        {/* <h5 className="mb-2">Physical</h5> */}
                        <div className="card-outline">
                            <h4>Range of motion</h4>
                            <Grid>
                                <LabeledMinMaxInput
                                    label={'AngleShoulderAA'}
                                    //currentState的对象根据stateVariable.Physical.ROM.AngleShoulderAA数组的Date属性来判断,
                                    //找出最新的Date属性的对象，然后取出Min和Max属性
                                    currentState={stateVariable?.Physical?.ROM?.AngleShoulderAA &&
                                        stateVariable?.Physical.ROM.AngleShoulderAA.length > 0 ? {
                                        min: getLatestObject(stateVariable.Physical.ROM.AngleShoulderAA).Min,
                                        max: getLatestObject(stateVariable.Physical.ROM.AngleShoulderAA).Max
                                    } : null}
                                    minValue={state.ROM.AngleShoulderAA.Min}
                                    maxValue={state.ROM.AngleShoulderAA.Max}
                                    onMinValueSet={(val) => setROM({
                                        ...state.ROM,
                                        AngleShoulderAA: { ...state.ROM.AngleShoulderAA, Min: val }
                                    })}
                                    onMaxValueSet={(val) => setROM({
                                        ...state.ROM,
                                        AngleShoulderAA: { ...state.ROM.AngleShoulderAA, Max: val }
                                    })}
                                />
                                <LabeledMinMaxInput
                                    label={'AngleShoulderFE'}
                                    currentState={stateVariable?.Physical?.ROM?.AngleShoulderFE &&
                                        stateVariable?.Physical.ROM.AngleShoulderFE.length > 0 ? {
                                        min: getLatestObject(stateVariable.Physical.ROM.AngleShoulderFE).Min,
                                        max: getLatestObject(stateVariable.Physical.ROM.AngleShoulderFE).Max
                                    } : null}
                                    minValue={state.ROM.AngleShoulderFE.Min}
                                    maxValue={state.ROM.AngleShoulderFE.Max}
                                    onMinValueSet={(val) => setROM({
                                        ...state.ROM,
                                        AngleShoulderFE: { ...state.ROM.AngleShoulderFE, Min: val }
                                    })}
                                    onMaxValueSet={(val) => setROM({
                                        ...state.ROM,
                                        AngleShoulderFE: { ...state.ROM.AngleShoulderFE, Max: val }
                                    })}
                                />
                                <LabeledMinMaxInput
                                    label={'AngleShoulderHFE'}
                                    currentState={stateVariable?.Physical?.ROM?.AngleShoulderHFE &&
                                        stateVariable?.Physical.ROM.AngleShoulderHFE.length > 0 ? {
                                        min: getLatestObject(stateVariable.Physical.ROM.AngleShoulderHFE).Min,
                                        max: getLatestObject(stateVariable.Physical.ROM.AngleShoulderHFE).Max
                                    } : null}
                                    minValue={state.ROM.AngleShoulderHFE.Min}
                                    maxValue={state.ROM.AngleShoulderHFE.Max}
                                    onMinValueSet={(val) => setROM({
                                        ...state.ROM,
                                        AngleShoulderHFE: { ...state.ROM.AngleShoulderHFE, Min: val }
                                    })}
                                    onMaxValueSet={(val) => setROM({
                                        ...state.ROM,
                                        AngleShoulderHFE: { ...state.ROM.AngleShoulderHFE, Max: val }
                                    })}
                                />
                                <LabeledMinMaxInput
                                    label={'AngleShoulderIE'}
                                    currentState={stateVariable?.Physical?.ROM?.AngleShoulderIE &&
                                        stateVariable?.Physical.ROM.AngleShoulderIE.length > 0 ? {
                                        min: getLatestObject(stateVariable.Physical.ROM.AngleShoulderIE).Min,
                                        max: getLatestObject(stateVariable.Physical.ROM.AngleShoulderIE).Max
                                    } : null}
                                    minValue={state.ROM.AngleShoulderIE.Min}
                                    maxValue={state.ROM.AngleShoulderIE.Max}
                                    onMinValueSet={(val) => setROM({
                                        ...state.ROM,
                                        AngleShoulderIE: { ...state.ROM.AngleShoulderIE, Min: val }
                                    })}
                                    onMaxValueSet={(val) => setROM({
                                        ...state.ROM,
                                        AngleShoulderIE: { ...state.ROM.AngleShoulderIE, Max: val }
                                    })}
                                />
                                <LabeledMinMaxInput
                                    label={'AngleElbowFE'}
                                    currentState={stateVariable?.Physical?.ROM?.AngleElbowFE &&
                                        stateVariable?.Physical.ROM.AngleElbowFE.length > 0 ? {
                                        min: getLatestObject(stateVariable.Physical.ROM.AngleElbowFE).Min,
                                        max: getLatestObject(stateVariable.Physical.ROM.AngleElbowFE).Max
                                    } : null}
                                    minValue={state.ROM.AngleElbowFE.Min}
                                    maxValue={state.ROM.AngleElbowFE.Max}
                                    onMinValueSet={(val) => setROM({
                                        ...state.ROM,
                                        AngleElbowFE: { ...state.ROM.AngleElbowFE, Min: val }
                                    })}
                                    onMaxValueSet={(val) => setROM({
                                        ...state.ROM,
                                        AngleElbowFE: { ...state.ROM.AngleElbowFE, Max: val }
                                    })}
                                />
                                <LabeledMinMaxInput
                                    label={'AngleWristPS'}
                                    currentState={stateVariable?.Physical?.ROM?.AngleWristPS &&
                                        stateVariable?.Physical.ROM.AngleWristPS.length > 0 ? {
                                        min: getLatestObject(stateVariable.Physical.ROM.AngleWristPS).Min,
                                        max: getLatestObject(stateVariable.Physical.ROM.AngleWristPS).Max
                                    } : null}
                                    minValue={state.ROM.AngleWristPS.Min}
                                    maxValue={state.ROM.AngleWristPS.Max}
                                    onMinValueSet={(val) => setROM({
                                        ...state.ROM,
                                        AngleWristPS: { ...state.ROM.AngleWristPS, Min: val }
                                    })}
                                    onMaxValueSet={(val) => setROM({
                                        ...state.ROM,
                                        AngleWristPS: { ...state.ROM.AngleWristPS, Max: val }
                                    })}
                                />
                                <LabeledMinMaxInput
                                    label={'AngleIndexFE'}
                                    currentState={stateVariable?.Physical?.ROM?.AngleIndexFE &&
                                        stateVariable?.Physical.ROM.AngleIndexFE.length > 0 ? {
                                        min: getLatestObject(stateVariable.Physical.ROM.AngleIndexFE).Min,
                                        max: getLatestObject(stateVariable.Physical.ROM.AngleIndexFE).Max
                                    } : null}
                                    minValue={state.ROM.AngleIndexFE.Min}
                                    maxValue={state.ROM.AngleIndexFE.Max}
                                    onMinValueSet={(val) => setROM({
                                        ...state.ROM,
                                        AngleIndexFE: { ...state.ROM.AngleIndexFE, Min: val }
                                    })}
                                    onMaxValueSet={(val) => setROM({
                                        ...state.ROM,
                                        AngleIndexFE: { ...state.ROM.AngleIndexFE, Max: val }
                                    })}
                                />
                            </Grid>
                        </div>
                        <div className="card-outline mt-2">
                            <h4>Strength</h4>
                            <Grid>
                                <LabeledNumberInput
                                    label={'RequiredSupportShoulderAA'}
                                    currentState={stateVariable?.Physical?.Strength?.RequiredSupportShoulderAA &&
                                        stateVariable?.Physical.Strength.RequiredSupportShoulderAA.length > 0 ?
                                        getLatestObject(stateVariable.Physical.Strength.RequiredSupportShoulderAA).Torque : null}
                                    value={state.Strength.RequiredSupportShoulderAA}
                                    onValueSet={(val) => setStrength({
                                        ...state.Strength,
                                        RequiredSupportShoulderAA: val
                                    })}
                                />
                                <LabeledNumberInput
                                    label={'RequiredSupportShoulderFE'}
                                    currentState={stateVariable?.Physical?.Strength?.RequiredSupportShoulderFE &&
                                        stateVariable?.Physical.Strength.RequiredSupportShoulderFE.length > 0 ?
                                        getLatestObject(stateVariable.Physical.Strength.RequiredSupportShoulderFE).Torque : null}
                                    value={state.Strength.RequiredSupportShoulderFE}
                                    onValueSet={(val) => setStrength({
                                        ...state.Strength,
                                        RequiredSupportShoulderFE: val
                                    })}
                                />
                                <LabeledNumberInput
                                    label={'RequiredSupportShoulderHFE'}
                                    currentState={stateVariable?.Physical?.Strength?.RequiredSupportShoulderHFE &&
                                        stateVariable?.Physical.Strength.RequiredSupportShoulderHFE.length > 0 ?
                                        getLatestObject(stateVariable.Physical.Strength.RequiredSupportShoulderHFE).Torque : null}
                                    value={state.Strength.RequiredSupportShoulderHFE}
                                    onValueSet={(val) => setStrength({
                                        ...state.Strength,
                                        RequiredSupportShoulderHFE: val
                                    })}
                                />
                                <LabeledNumberInput
                                    label={'RequiredSupportShoulderIE'}
                                    currentState={stateVariable?.Physical?.Strength?.RequiredSupportShoulderIE &&
                                        stateVariable?.Physical.Strength.RequiredSupportShoulderIE.length > 0 ?
                                        getLatestObject(stateVariable.Physical.Strength.RequiredSupportShoulderIE).Torque : null}
                                    value={state.Strength.RequiredSupportShoulderIE}
                                    onValueSet={(val) => setStrength({
                                        ...state.Strength,
                                        RequiredSupportShoulderIE: val
                                    })}
                                />
                                <LabeledNumberInput
                                    label={'RequiredSupportElbowFE'}
                                    currentState={stateVariable?.Physical?.Strength?.RequiredSupportElbowFE &&
                                        stateVariable?.Physical.Strength.RequiredSupportElbowFE.length > 0 ?
                                        getLatestObject(stateVariable.Physical.Strength.RequiredSupportElbowFE).Torque : null}
                                    value={state.Strength.RequiredSupportElbowFE}
                                    onValueSet={(val) => setStrength({
                                        ...state.Strength,
                                        RequiredSupportElbowFE: val
                                    })}
                                />
                                <LabeledNumberInput
                                    label={'RequiredSupportGrip'}
                                    currentState={stateVariable?.Physical?.Strength?.RequiredSupportGrip &&
                                        stateVariable?.Physical.Strength.RequiredSupportGrip.length > 0 ?
                                        getLatestObject(stateVariable.Physical.Strength.RequiredSupportGrip).FESSupport : null}
                                    value={state.Strength.RequiredSupportGrip}
                                    onValueSet={(val) => setStrength({ ...state.Strength, RequiredSupportGrip: val })}
                                />
                            </Grid>
                        </div>
                        <div className="card-outline mt-2">
                            <h4>Spasticity</h4>
                            <Grid>
                                <LabeledNumberInput
                                    label={'ShoulderAA'}
                                    currentState={getCurrentState_Spasticity(stateVariable, 'shoulderAA')}
                                    value={state.Spasticity.ShoulderAA}
                                    onValueSet={(val) => setSpasticity({ ...state.Spasticity, ShoulderAA: val })}
                                />
                                <LabeledNumberInput
                                    label={'ShoulderFE'}
                                    currentState={getCurrentState_Spasticity(stateVariable, 'shoulderFE')}
                                    value={state.Spasticity.ShoulderFE}
                                    onValueSet={(val) => setSpasticity({ ...state.Spasticity, ShoulderFE: val })}
                                />
                                <LabeledNumberInput
                                    label={'ShoulderHFE'}
                                    currentState={getCurrentState_Spasticity(stateVariable, 'shoulderHFE')}
                                    value={state.Spasticity.ShoulderHFE}
                                    onValueSet={(val) => setSpasticity({ ...state.Spasticity, ShoulderHFE: val })}
                                />
                                <LabeledNumberInput
                                    label={'ShoulderIE'}
                                    currentState={getCurrentState_Spasticity(stateVariable, 'shoulderIE')}
                                    value={state.Spasticity.ShoulderIE}
                                    onValueSet={(val) => setSpasticity({ ...state.Spasticity, ShoulderIE: val })}
                                />
                                <LabeledNumberInput
                                    label={'Elbow'}
                                    currentState={getCurrentState_Spasticity(stateVariable, 'elbow')}
                                    value={state.Spasticity.Elbow}
                                    onValueSet={(val) => setSpasticity({ ...state.Spasticity, Elbow: val })}

                                />
                                <LabeledNumberInput
                                    label={'Hand'}
                                    currentState={getCurrentState_Spasticity(stateVariable, 'hand')}
                                    value={state.Spasticity.Hand}
                                    onValueSet={(val) => setSpasticity({ ...state.Spasticity, Hand: val })}
                                />
                            </Grid>
                        </div>
                        <div className="card-outline mt-2">
                            <h4>Endurance</h4>
                            <Grid>
                                <LabeledNumberInput
                                    label={'Shoulder'}
                                    currentState={stateVariable?.Physical?.Endurance?.Shoulder &&
                                        stateVariable?.Physical.Endurance.Shoulder.length > 0 ?
                                        getLatestObject(stateVariable.Physical.Endurance.Shoulder).TimeToFatigue : null}
                                    value={state.Endurance.Shoulder}
                                    onValueSet={(val) => setEndurance({ ...state.Endurance, Shoulder: val })}
                                />
                                <LabeledNumberInput
                                    label={'Elbow'}
                                    currentState={stateVariable?.Physical?.Endurance?.Elbow &&
                                        stateVariable?.Physical.Endurance.Elbow.length > 0 ?
                                        getLatestObject(stateVariable.Physical.Endurance.Elbow).TimeToFatigue : null}
                                    value={state.Endurance.Elbow}
                                    onValueSet={(val) => setEndurance({ ...state.Endurance, Elbow: val })}
                                />
                                <LabeledNumberInput
                                    label={'Hand'}
                                    currentState={stateVariable?.Physical?.Endurance?.Hand &&
                                        stateVariable?.Physical.Endurance.Hand.length > 0 ?
                                        getLatestObject(stateVariable.Physical.Endurance.Hand).TimeToFatigue : null}
                                    value={state.Endurance.Hand}
                                    onValueSet={(val) => setEndurance({ ...state.Endurance, Hand: val })}
                                />
                            </Grid>
                        </div>
                    </div></Collapsible>

                    <div className="card-outline mt-4">
                        <h5 className="mb-2">Cognitive</h5>
                    </div>
                </>
            </SideDialog>
        }
    </>
};

const Goals = (props: { title: string, goal: string, onEdit: () => void }) =>
{
    return <div className='flex flex-col'>
        <div className={`flex justify-between`}>
            <h5 className='whitespace-nowrap'>{props.title}
            </h5>
            <AiOutlineEdit onClick={props.onEdit}
                className='btn-icon text-2xl w-5 h-5 text-gray-500 cursor-pointer bg-primary hover:bg-secondary2'
            />
        </div>
        <span className='max-w-full'>{props.goal}</span>
    </div>
};
