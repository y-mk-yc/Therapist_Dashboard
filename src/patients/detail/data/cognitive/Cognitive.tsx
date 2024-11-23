import {FC} from "react";
import {BodyPart} from "../Data";
import {BodyPartSelector} from "../common/BodyPartSelector";
import {LabeledGraph} from "../common/LabeledGraph";
import {Checkbox} from "./Checkbox";
import {useParams} from "react-router-dom";
import {useGetPatientsByPatientIdDataQuery} from "../../../../store/rehybApi";
import {Loader} from "../../../../common/Loader";
import {LazyPlot} from "../../../../common/graphs/LazyPlotly";

const createData = (x: string[], y: number[]): Plotly.Data => ({
    x: x,
    y: y,
    type: 'bar',
    marker: {
        color: '#435FE180'
    }
})

const layout: Partial<Plotly.Layout> = {
    barmode: 'stack',
    width: 400,
    height: 300,
    margin: {t: 8, b: 32, l: 24, r: 24},
    paper_bgcolor: 'rgba(255,255,255,0)',
    plot_bgcolor: 'rgba(255,255,255,0)',
    legend: {"orientation": "h"}
}

const config: Partial<Plotly.Config> = {
    displaylogo: false,
    displayModeBar: false
}


export const Cognitive: FC<{
    setSelectedBodyPart: (part: BodyPart) => void,
    selectedBodyPart: BodyPart
}> = ({setSelectedBodyPart, selectedBodyPart}) => {
    /* const {patientId} = useParams()
     const {data, isLoading} = useGetPatientsByPatientIdDataQuery({patientId: patientId!})
     if (isLoading) return <Loader/>
     if (!data) return <>No data</>

     const rehybScoreData = createData(
         data.cognitive.rehybCognitiveScore.map(s => s.date),
         data.cognitive.rehybCognitiveScore.map(s => s.score)
     )

     const timeToFatigue = createData(
         data.cognitive.timeToCognitiveFatigue.map(s => s.date),
         data.cognitive.timeToCognitiveFatigue.map(s => s.score)
     )*/

    return <>not implemented</>
    /*return <>
        <BodyPartSelector setSelectedBodyPart={setSelectedBodyPart} selectedBodyPart={selectedBodyPart}/>
        <div className={'flex flex-col gap-8 pt-12 @6xl:pt-0 w-96'}>
            <LabeledGraph
                label={'ReHyb Cognitive Score'}
                tip={'The score from the ReHyb cognitive exercises.'}
                classNameTip={'min-w-[300px]'}
            >
                <LazyPlot data={[rehybScoreData]} layout={layout} config={config}/>
            </LabeledGraph>
            <LabeledGraph
                label={'Time to cognitive fatigue'}
                tip={'Average time for which the user can do exercises.'}
                classNameTip={'min-w-[300px]'}
            >
                <LazyPlot data={[timeToFatigue]} layout={layout} config={config}/>
            </LabeledGraph>
            <div className={'flex justify-start gap-8'}>
                <LabeledGraph label={'Neglect'}>
                    <Checkbox onValueSet={() => {
                    }} value={data.cognitive.neglect}
                    />
                </LabeledGraph>
                <LabeledGraph label={'Aphasia'}>
                    <Checkbox onValueSet={() => {
                    }} value={data.cognitive.aphasia}
                    />
                </LabeledGraph>
            </div>
        </div>
    </>*/
}