import editIcon from "./editIcon.svg";
import {FC, useEffect, useState} from "react";
import {Dialog} from "../../../../common/dialogs/Dialog";
import {
    PatientIdManualAssessmentBody, Speed, useDeleteManualAssessmentByPatientIdAndDateMutation,
    useDeleteOneVariableByPatientIdAndDateMutation,
    useGetPatientsByPatientIdDataQuery,
    usePostManualAssessmentByPatientIdMutation,
    usePostPatientsByPatientIdManualAssessmentMutation,
    VariableType
} from "../../../../store/rehybApi";
import {LabeledInput, LabeledSelect} from "../../../../common/Inputs";
import {capitalize, keyToLabel} from "../../../../common/textUtils";
import {Loader} from "../../../../common/Loader";
import {useParams} from "react-router-dom";
import {AiOutlineClose} from "react-icons/ai";
import {BodyPart} from "../Data";


export function getFormattedLocalDate(date: Date) {
    // 提取年、月、日
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以要加1，并确保两位数格式
    const day = String(date.getDate()).padStart(2, '0'); // 确保两位数格式
    // 格式化为 YYYY-MM-DD
    return `${year}-${month}-${day}`;
}


export const ROMManualAssessmentButton: FC<{ initial: PatientIdManualAssessmentBody }> = (props) => {
    const {patientId} = useParams();
    const [showingDialog, setShowingDialog] = useState(false);
    const [sendAssessment, {isLoading}] = usePostPatientsByPatientIdManualAssessmentMutation();
    const [values, setValues] = useState(props.initial);
    const [tab, setTab] = useState<TabType>('add');

    const setValue = (key: string, value: any, type: 'date' | 'number') => {
        const newValue = type == 'number' ? +value : value;
        setValues({
            ...values,
            [key]: newValue
        });
        // console.log("values:", values);
    }

    const UNIT_MAP = {
        'angle': '°',
        'strength': 'N⋅m',
        'torque': 'N⋅m',
        'timeToFatigue': 'mins',
        'speed': 'm/s',
        'minAngle': '°',
        'maxAngle': '°',
    }

    return <>
        <button className={'inline-flex h-5 aspect-square'} onClick={() => setShowingDialog(true)}>
            <img className={'rounded-none w-full h-full object-fill'} src={editIcon} alt={'Edit Icon'}/>
        </button>
        {showingDialog &&
            <Dialog
                onClose={() => setShowingDialog(false)}
                className={'max-w-sm gap-2 '}>
                <h3>Manual assessment</h3>
                <Tabs value={tab} change={setTab}/>
                {isLoading && <Loader/>}
                {tab == 'remove' && <ROMRemove variable={props.initial.variable}/>}
                {tab == 'add' && !isLoading && <>
                    {Object.keys(props.initial).map(key => {
                        if (key === 'variable') return;
                        let type: 'date' | 'number' = 'number'
                        const value = values[key as keyof PatientIdManualAssessmentBody]
                        if (key === 'variable' || key === 'date') {
                            type = 'date';
                        } else {
                            type = 'number';
                        }
                        let unit = key in UNIT_MAP ? `(${UNIT_MAP[key as keyof typeof UNIT_MAP]})` : ''
                        // console.log({key, value, type, unit});
                        return <LabeledInput
                            key={key}
                            label={`${keyToLabel(key)} ${unit}`}
                            type={type}
                            placeholder={''}
                            onValueSet={newValue => setValue(key, newValue, type)}
                            value={value}
                            expand={true}
                        />
                    })}
                    <button
                        className={'btn-primary mt-4 justify-center'}
                        onClick={async () => {
                            // console.log(patientId!);
                            const result = await sendAssessment({
                                patientId: patientId!,
                                patientIdManualAssessmentBody: values
                            })
                            if ('error' in result) console.log('Error submitting manual assessment');
                            setShowingDialog(false);
                        }}
                    >Submit
                    </button>
                </>}
            </Dialog>}
    </>
}

type TabType = 'add' | 'remove';
const Tabs: FC<{ value: TabType, change: (newTab: TabType) => void }> = (props) => {
    const createTab = (tab: TabType) => {
        return <button
            onClick={() => props.change(tab)}
            className={
                `text-primary flex-1 border-b-4 p-2 hover:border-secondary
             ${props.value == tab ? 'border-primary' : 'border-transparent'}`}>{capitalize(tab)}
        </button>
    }

    return <div className={'flex mb-2'}>
        {createTab('add')}
        {createTab('remove')}
    </div>
};

const ROMRemove = (props: { variable: VariableType }) => {
    const {patientId} = useParams();
    const {data, isLoading} = useGetPatientsByPatientIdDataQuery({PatientID: patientId!});
    const [deleteOneVariable] = useDeleteOneVariableByPatientIdAndDateMutation();
    if (isLoading || !data) return <Loader/>

    if (["SHFE", "SFE", "SIE", "EFE"].includes(props.variable)) {
        let ROMdata;
        if (props.variable === "SHFE") {
            ROMdata = data.Physical?.ROM?.AngleShoulderHFE;
        } else if (props.variable === "SFE") {
            ROMdata = data.Physical?.ROM?.AngleShoulderFE;
        } else if (props.variable === "SIE") {
            ROMdata = data.Physical?.ROM?.AngleShoulderIE;
        } else {
            ROMdata = data.Physical?.ROM?.AngleElbowFE;
        }
        if (!ROMdata) return <span>No data for this variable</span>
        return <div className={'flex overflow-y-scroll h-60 border'}>
            <table className={'w-full'}>
                <thead className={'sticky top-0 bg-white'}>
                <tr>
                    <th>Time</th>
                    <th>Min</th>
                    <th>Max</th>
                    <th></th>
                    {/* 滚动时掩盖 Delete button */}
                </tr>
                </thead>
                <tbody>
                {ROMdata.map((item, idx) => (
                    <tr key={idx}>
                        <td className={'text-center'}>{new Date(item.Date).toLocaleDateString()}</td>
                        <td className={'text-center'}>{parseFloat(item.Min.toFixed(1))} °</td>
                        <td className={'text-center'}>{parseFloat(item.Max.toFixed(1))} °</td>
                        <td>
                            <button
                                className='btn-icon aspect-square'
                                onClick={async () => {
                                    await deleteOneVariable({
                                        patientId: patientId!,
                                        date: item.Date,
                                        variable: props.variable
                                    });
                                }}>
                                <AiOutlineClose className={'h-2'}/>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

    } else {
        return <span>Not implemented</span>
    }
}


export const StrengthManualAssessmentButton
    = (props: {
    strength: number,
    date: string,
    variable: VariableType,
    bodyPart: BodyPart
}) => {
    const {patientId} = useParams();
    const {data: SV, isLoading: isLoadingSV} = useGetPatientsByPatientIdDataQuery({PatientID: patientId!});
    const [showingDialog, setShowingDialog] = useState(false);
    const [sendAssessment, {isLoading}] = usePostManualAssessmentByPatientIdMutation();
    const [values, setValues] = useState(props);
    const [tab, setTab] = useState<TabType>('add');
    const [removeVariable, setRemoveVariable] = useState<VariableType>(props.bodyPart === 'shoulder' ? "SHFE" : "EFE");
    useEffect(() => {
        setValues(props);
        setRemoveVariable(props.bodyPart === 'shoulder' ? "SHFE" : "EFE");
    }, [props.bodyPart]);
    const [deleteOneVariable] = useDeleteManualAssessmentByPatientIdAndDateMutation();

    let data;

    if (removeVariable === "SHFE") {
        data = SV?.Physical?.Strength?.RequiredSupportShoulderHFE;
    } else if (removeVariable === "SFE") {
        data = SV?.Physical?.Strength?.RequiredSupportShoulderFE;
    } else if (removeVariable === "SIE") {
        data = SV?.Physical?.Strength?.RequiredSupportShoulderIE;
    } else if (removeVariable === "EFE") {
        data = SV?.Physical?.Strength?.RequiredSupportElbowFE;
    }

    // console.log(removeVariable,data);

    return <>
        <button className={'inline-flex h-5 aspect-square'} onClick={() => setShowingDialog(true)}>
            <img className={'rounded-none w-full h-full object-fill'} src={editIcon} alt={'Edit Icon'}/>
        </button>
        {showingDialog &&
            <Dialog
                onClose={() => setShowingDialog(false)}
                className={'max-w-sm gap-2 '}>
                <h3>Manual assessment</h3>
                <Tabs value={tab} change={setTab}/>
                {isLoading && <Loader/>}
                {tab == 'remove' && (isLoadingSV ? <Loader/> :
                    <div className={'flex-col'}>
                        <LabeledSelect
                            label={`Variable`}
                            placeholder={''}
                            onValueSet={value => setRemoveVariable(value as VariableType)}
                            value={removeVariable}
                            values={props.bodyPart === "shoulder" ? [
                                {value: 'SHFE', text: 'Horizontal Flexion/Extension'},
                                {value: 'SFE', text: 'Flexion/Extension'},
                                {value: 'SIE', text: 'Internal/External Rotation'},
                            ] : [{value: 'EFE', text: 'Flexion/Extension'}]}
                        />
                        <div className={'flex overflow-y-scroll h-60 border mt-4'}>
                            <table className={'w-full'}>
                                <thead className={'sticky top-0 bg-white'}>
                                <tr>
                                    <th>Time</th>
                                    <th>Strength</th>
                                    <th></th>
                                    {/* 滚动时掩盖 Delete button */}
                                </tr>
                                </thead>
                                <tbody>
                                {!data && <tr>
                                    <td><span>No data for this variable</span></td>
                                </tr>}
                                {data && data.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className={'text-center'}>{new Date(item.Date).toLocaleDateString()}</td>
                                        <td className={'text-center'}>{parseFloat(item.Torque.toFixed(1))} (N⋅m)</td>
                                        <td>
                                            <button
                                                className='btn-icon aspect-square'
                                                onClick={async () => {
                                                    await deleteOneVariable({
                                                        patientId: patientId!,
                                                        body: {
                                                            strengthGraph: {
                                                                date: item.Date,
                                                                variable: removeVariable
                                                            }
                                                        }
                                                    });
                                                }}>
                                                <AiOutlineClose className={'h-2'}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                    </div>)


                }
                {tab == 'add' && !isLoading && <>
                    <LabeledInput
                        label={`Strength (N⋅m)`}
                        type={'number'}
                        placeholder={''}
                        onValueSet={newValue => setValues({...values, strength: +newValue})}
                        value={String(values.strength)}
                        expand={true}
                    />
                    <LabeledSelect
                        label={`Variable`}
                        placeholder={''}
                        values={props.bodyPart === "shoulder" ? [
                            {value: 'SHFE', text: 'Horizontal Flexion/Extension'},
                            {value: 'SFE', text: 'Flexion/Extension'},
                            {value: 'SIE', text: 'Internal/External Rotation'},
                        ] : [{value: 'EFE', text: 'Flexion/Extension'}]}
                        onValueSet={newValue => setValues({...values, variable: newValue as VariableType})}
                        value={values.variable}
                        expand={true}
                    />
                    <LabeledInput
                        label={`Date`}
                        type={'date'}
                        placeholder={''}
                        onValueSet={newValue => setValues({...values, date: newValue})}
                        value={values.date}
                        expand={true}
                    />
                    <button
                        className={'btn-primary mt-4 justify-center'}
                        onClick={async () => {
                            const {bodyPart, ...strengthGraph} = values;
                            const result = await sendAssessment({
                                patientId: patientId!,
                                body: {strengthGraph: strengthGraph}
                            })
                            if ('error' in result) console.log('Error submitting manual assessment');
                            setShowingDialog(false);
                        }}
                    >Submit
                    </button>
                </>}
            </Dialog>}
    </>
}

export const EnduranceManualAssessmentButton
    = (props: {
    timeToFatigue: number,
    date: string,
    bodyPart: BodyPart
}) => {
    const {patientId} = useParams();
    const {data: SV, isLoading: isLoadingSV} = useGetPatientsByPatientIdDataQuery({PatientID: patientId!});
    const [showingDialog, setShowingDialog] = useState(false);
    const [sendAssessment, {isLoading}] = usePostManualAssessmentByPatientIdMutation();
    const [values, setValues] = useState(props);
    const [tab, setTab] = useState<TabType>('add');
    useEffect(() => {
        setValues(props);
    }, [props.bodyPart]);
    const [deleteOneVariable] = useDeleteManualAssessmentByPatientIdAndDateMutation();

    let data;

    if (props.bodyPart === "shoulder") {
        data = SV?.Physical?.Endurance?.Shoulder;
    } else if (props.bodyPart === "elbow") {
        data = SV?.Physical?.Endurance?.Elbow;
    }

    // console.log(data,values);

    return <>
        <button className={'inline-flex h-5 aspect-square'} onClick={() => setShowingDialog(true)}>
            <img className={'rounded-none w-full h-full object-fill'} src={editIcon} alt={'Edit Icon'}/>
        </button>
        {showingDialog &&
            <Dialog
                onClose={() => setShowingDialog(false)}
                className={'max-w-sm gap-2 '}>
                <h3>Manual assessment</h3>
                <Tabs value={tab} change={setTab}/>
                {isLoading && <Loader/>}
                {tab == 'remove' && (isLoadingSV ? <Loader/> :
                    <div className={'flex-col'}>
                        <div className={'flex overflow-y-scroll h-60 border mt-4'}>
                            <table className={'w-full'}>
                                <thead className={'sticky top-0 bg-white'}>
                                <tr>
                                    <th>Time</th>
                                    <th>Time To Fatigue</th>
                                    <th></th>
                                    {/* 滚动时掩盖 Delete button */}
                                </tr>
                                </thead>
                                <tbody>
                                {!data && <tr>
                                    <td><span>No data for this variable</span></td>
                                </tr>}
                                {data && data.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className={'text-center'}>{new Date(item.Date).toLocaleDateString()}</td>
                                        <td className={'text-center'}>{parseFloat(item.TimeToFatigue.toFixed(1))} (mins)</td>
                                        <td>
                                            <button
                                                className='btn-icon aspect-square'
                                                onClick={async () => {
                                                    await deleteOneVariable({
                                                        patientId: patientId!,
                                                        body: {
                                                            enduranceGraph: {
                                                                date: item.Date,
                                                                bodyPart: props.bodyPart,
                                                            },
                                                        }
                                                    });
                                                }}>
                                                <AiOutlineClose className={'h-2'}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                    </div>)


                }
                {tab == 'add' && !isLoading && <>
                    <LabeledInput
                        label={`Time To Fatigue (mins)`}
                        type={'number'}
                        placeholder={''}
                        onValueSet={newValue => setValues({...values, timeToFatigue: +newValue})}
                        value={String(values.timeToFatigue)}
                        expand={true}
                    />
                    <LabeledInput
                        label={`Date`}
                        type={'date'}
                        placeholder={''}
                        onValueSet={newValue => setValues({...values, date: newValue})}
                        value={values.date}
                        expand={true}
                    />
                    <button
                        className={'btn-primary mt-4 justify-center'}
                        onClick={async () => {
                            const result = await sendAssessment({
                                patientId: patientId!,
                                body: {enduranceGraph: values}
                            })
                            if ('error' in result) console.log('Error submitting manual assessment');
                            setShowingDialog(false);
                        }}
                    >Submit
                    </button>
                </>}
            </Dialog>}
    </>
}

export const SpasticityManualAssessmentButton
    = (props: {
    torque: number,
    angle: number,
    date: string,
    speed: Speed,
    bodyPart: BodyPart,
    variable: VariableType,
}) => {
    const {patientId} = useParams();
    const {data: SV, isLoading: isLoadingSV} = useGetPatientsByPatientIdDataQuery({PatientID: patientId!});
    const [showingDialog, setShowingDialog] = useState(false);
    const [sendAssessment, {isLoading}] = usePostManualAssessmentByPatientIdMutation();
    const [values, setValues] = useState(props);
    const [tab, setTab] = useState<TabType>('add');
    const [removeVariable, setRemoveVariable] = useState<VariableType>(props.bodyPart === 'shoulder' ? "SHFE" : "EFE");
    const [removeSpeed, setRemoveSpeed] = useState<Speed>("Slow");
    const [removeTime, setRemoveTime] = useState<string>('No date');
    const [dateArray, setDateArray] = useState<{ value: string, text: string }[]>([]);
    const [angleTorqueData, setAngleTorqueData] = useState<{ Angle: number, Torque: number }[]>([]);


    const [deleteOneVariable] = useDeleteManualAssessmentByPatientIdAndDateMutation();

    useEffect(() => {
        setValues(props);
        setRemoveVariable(props.bodyPart === 'shoulder' ? "SHFE" : "EFE");
        setRemoveSpeed("Slow");
    }, [props.bodyPart]);

    useEffect(() => {
        let newDateArray: { value: string, text: string }[] = [];
        if (removeVariable === "SHFE") {
            newDateArray = SV?.Physical?.Spasticity?.ShoulderHFE?.map(item => ({
                value: item.Date,
                text: new Date(item.Date).toLocaleDateString()
            })) ?? [];
        } else if (removeVariable === "SFE") {
            newDateArray = SV?.Physical?.Spasticity?.ShoulderFE?.map(item => ({
                value: item.Date,
                text: new Date(item.Date).toLocaleDateString()
            })) ?? [];
        } else if (removeVariable === "SIE") {
            newDateArray = SV?.Physical?.Spasticity?.ShoulderIE?.map(item => ({
                value: item.Date,
                text: new Date(item.Date).toLocaleDateString()
            })) ?? [];
        } else if (removeVariable === "EFE") {
            newDateArray = SV?.Physical?.Spasticity?.ElbowFE?.map(item => ({
                value: item.Date,
                text: new Date(item.Date).toLocaleDateString()
            })) ?? [];
        }
        setDateArray(newDateArray);
        setRemoveTime(newDateArray[0]?.value ?? 'No date');
    }, [removeVariable, SV]);


    useEffect(() => {
        let newAngleTorqueData: { Angle: number, Torque: number }[] = [];
        if (removeVariable === "SHFE") {
            newAngleTorqueData = SV?.Physical?.Spasticity?.ShoulderHFE?.find(item => item.Date === removeTime)?.Assessment?.find(item => item.Speed === removeSpeed)?.Spasticity ?? [];
        } else if (removeVariable === "SFE") {
            newAngleTorqueData = SV?.Physical?.Spasticity?.ShoulderFE?.find(item => item.Date === removeTime)?.Assessment?.find(item => item.Speed === removeSpeed)?.Spasticity ?? [];
        } else if (removeVariable === "SIE") {
            newAngleTorqueData = SV?.Physical?.Spasticity?.ShoulderIE?.find(item => item.Date === removeTime)?.Assessment?.find(item => item.Speed === removeSpeed)?.Spasticity ?? [];
        } else if (removeVariable === "EFE") {
            newAngleTorqueData = SV?.Physical?.Spasticity?.ElbowFE?.find(item => item.Date === removeTime)?.Assessment?.find(item => item.Speed === removeSpeed)?.Spasticity ?? [];
        }
        setAngleTorqueData(newAngleTorqueData);
    }, [SV, removeVariable, removeSpeed, removeTime]);

    // console.log({removeVariable, removeSpeed, removeTime, dateArray, angleTorqueData});


    return <>
        <button className={'inline-flex h-5 aspect-square'} onClick={() => setShowingDialog(true)}>
            <img className={'rounded-none w-full h-full object-fill'} src={editIcon} alt={'Edit Icon'}/>
        </button>
        {showingDialog &&
            <Dialog
                onClose={() => setShowingDialog(false)}
                className={'max-w-sm gap-2 '}>
                <h3>Manual assessment</h3>
                <Tabs value={tab} change={setTab}/>
                {isLoading && <Loader/>}
                {tab == 'remove' && (isLoadingSV ? <Loader/> :
                        <div className={'flex-col'}>
                            <LabeledSelect
                                label={`Variable`}
                                placeholder={''}
                                onValueSet={value => setRemoveVariable(value as VariableType)}
                                value={removeVariable}
                                values={props.bodyPart === "shoulder" ? [
                                    {value: 'SHFE', text: 'Horizontal Flexion/Extension'},
                                    {value: 'SFE', text: 'Flexion/Extension'},
                                    {value: 'SIE', text: 'Internal/External Rotation'},
                                ] : [{value: 'EFE', text: 'Flexion/Extension'}]}
                            />
                            <LabeledSelect
                                label={`Date`}
                                placeholder={''}
                                onValueSet={value => setRemoveTime(value)}
                                value={removeTime}
                                values={dateArray}
                            />
                            <LabeledSelect
                                label={`Speed`}
                                placeholder={''}
                                onValueSet={value => setRemoveSpeed(value as Speed)}
                                value={removeSpeed}
                                values={[
                                    {value: 'Slow', text: 'Slow'},
                                    {value: 'Moderate', text: 'Moderate'},
                                    {value: 'Fast', text: 'Fast'}
                                ]}
                            />
                            <div className={'flex overflow-y-scroll h-60 border mt-4'}>
                                <table className={'w-full'}>
                                    <thead className={'sticky top-0 bg-white'}>
                                    <tr>
                                        <th>Angle</th>
                                        <th>Torque</th>
                                        <th></th>
                                        {/* 滚动时掩盖 Delete button */}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {angleTorqueData.length === 0 && <tr>
                                        <td><span>No data for this variable</span></td>
                                    </tr>}
                                    {angleTorqueData.length > 0 && angleTorqueData.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className={'text-center'}>{item.Angle} °</td>
                                            <td className={'text-center'}>{parseFloat(item.Torque.toFixed(1))} (N⋅m)</td>
                                            <td>
                                                <button
                                                    className='btn-icon aspect-square'
                                                    onClick={async () => {
                                                        console.log({removeTime,removeVariable,removeSpeed,item});
                                                        await deleteOneVariable({
                                                            patientId: patientId!,
                                                            body: {
                                                                spasticityGraph: {
                                                                    date: removeTime,
                                                                    variable: removeVariable,
                                                                    speed: removeSpeed,
                                                                    angle: item.Angle
                                                                }
                                                            }
                                                        });
                                                    }}>
                                                    <AiOutlineClose className={'h-2'}/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                )}
                {tab == 'add' && !isLoading && <>
                    <LabeledSelect
                        label={`Variable`}
                        placeholder={''}
                        values={props.bodyPart === "shoulder" ? [
                            {value: 'SHFE', text: 'Horizontal Flexion/Extension'},
                            {value: 'SFE', text: 'Flexion/Extension'},
                            {value: 'SIE', text: 'Internal/External Rotation'},
                        ] : [{value: 'EFE', text: 'Flexion/Extension'}]}
                        onValueSet={newValue => setValues({...values, variable: newValue as VariableType})}
                        value={values.variable}
                        expand={true}
                    />
                    <LabeledSelect
                        label={`Speed`}
                        placeholder={''}
                        values={[
                            {value: 'Slow', text: 'Slow'},
                            {value: 'Moderate', text: 'Moderate'},
                            {value: 'Fast', text: 'Fast'}
                        ]}
                        onValueSet={newValue => setValues({...values, speed: newValue as Speed})}
                        value={values.speed}
                        expand={true}
                    />
                    <LabeledInput
                        label={`Angle (°)`}
                        type={'number'}
                        placeholder={''}
                        onValueSet={newValue => setValues({...values, angle: +newValue})}
                        value={String(values.angle)}
                        expand={true}
                    />
                    <LabeledInput
                        label={`Torque (N⋅m)`}
                        type={'number'}
                        placeholder={''}
                        onValueSet={newValue => setValues({...values, torque: +newValue})}
                        value={String(values.torque)}
                        expand={true}
                    />
                    <LabeledInput
                        label={`Date`}
                        type={'date'}
                        placeholder={''}
                        onValueSet={newValue => setValues({...values, date: newValue})}
                        value={values.date}
                        expand={true}
                    />
                    <button
                        className={'btn-primary mt-4 justify-center'}
                        onClick={async () => {
                            console.log("values", values);
                            const {bodyPart, ...spasticityGraph} = values;
                            const result = await sendAssessment({
                                patientId: patientId!,
                                body: {spasticityGraph: spasticityGraph}
                            })
                            if ('error' in result) console.log('Error submitting manual assessment');
                            setShowingDialog(false);
                        }}
                    >Submit
                    </button>
                </>}
            </Dialog>}
    </>
}