import { ReactNode } from "react";
import { ReHybTooltip } from "../../../../common/dialogs/Tooltip";
import editIcon from './editIcon.svg'
import
    {
        EnduranceManualAssessmentButton,
        ROMManualAssessmentButton, SpasticityManualAssessmentButton,
        StrengthManualAssessmentButton
    } from "./ManualAssesmentButton";
import { PatientIdManualAssessmentBody, Speed, VariableType } from "../../../../store/rehybApi";
import { BodyPart } from "../Data";

export const LabeledGraph = (props: {
    label: string,
    className?: string,
    innerClassName?: string,
    children: ReactNode,
    tip?: string,
    classNameTip?: string,
    editInitial?: PatientIdManualAssessmentBody,
    editInitialStrength?: {
        strength: number,
        date: string,
        variable: VariableType,
        bodyPart: BodyPart
    },
    editInitialEndurance?: {
        timeToFatigue: number,
        date: string,
        bodyPart: BodyPart
    },
    editInitialSpasticity?: {
        torque: number,
        date: string,
        bodyPart: BodyPart,
        variable: VariableType,
        speed: Speed,
        angle: number
    }
}) =>
{
    return <div className={`flex flex-col gap-2 ${props.className}`}>
        <div className={'flex gap-2 items-center whitespace-nowrap'}>
            <h3>{props.label}</h3>
            {props.tip && <ReHybTooltip tip={props.tip} className={props.classNameTip} />}
            {props.editInitialStrength &&
                <StrengthManualAssessmentButton
                    strength={props.editInitialStrength.strength}
                    date={props.editInitialStrength.date}
                    variable={props.editInitialStrength.variable}
                    bodyPart={props.editInitialStrength.bodyPart}
                />}
            {props.editInitialEndurance &&
                <EnduranceManualAssessmentButton
                    timeToFatigue={props.editInitialEndurance.timeToFatigue}
                    date={props.editInitialEndurance.date}
                    bodyPart={props.editInitialEndurance.bodyPart}
                />}
            {props.editInitialSpasticity &&
                <SpasticityManualAssessmentButton
                    torque={props.editInitialSpasticity.torque}
                    date={props.editInitialSpasticity.date}
                    bodyPart={props.editInitialSpasticity.bodyPart}
                    variable={props.editInitialSpasticity.variable}
                    speed={props.editInitialSpasticity.speed}
                    angle={props.editInitialSpasticity.angle}
                />}
        </div>
        <div className={`flex flex-col gap-2 ${props.innerClassName}`}>
            {props.children}
        </div>
    </div>
}