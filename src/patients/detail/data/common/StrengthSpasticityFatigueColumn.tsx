import {LabeledGraph} from "./LabeledGraph"
import {SpasticityGraph} from "./SpasticityGraph"
import {
    Endurance,
    PatientIdManualAssessmentBody,
    Spasticity,
    StateVariable,
    Strength
} from "../../../../store/rehybApi";
import {config, createDataConfig, createLineLayout} from "./lineGraphHelper";
import {StrengthGraph} from "./StrengthGraph";
import {EnduranceGraph} from "./EnduranceGraph";
import {LabeledSelect} from "../../../../common/Inputs";
import {LazyPlot} from "../../../../common/graphs/LazyPlotly";
import { BodyPart } from "../Data";

export const StrengthSpasticityFatigueColumn = (props: {
    strength: Strength,
    spasticity: Spasticity,
    cutOffDate: Date
    timeToFatigue: Endurance,
    // variable: PatientIdManualAssessmentBody['variable']
    bodyPart: BodyPart
    className?: string,
}) => {
    return <div className={`flex flex-col px-8 gap-8 ${props.className}`}>
        <StrengthGraph strength={props.strength} bodyPart={props.bodyPart} cutOffDate={props.cutOffDate}/>
        <SpasticityGraph spasticity={props.spasticity} bodyPart={props.bodyPart}/>
        <EnduranceGraph timeToFatigue={props.timeToFatigue} cutOffDate={props.cutOffDate} bodyPart={props.bodyPart}/>
    </div>
}