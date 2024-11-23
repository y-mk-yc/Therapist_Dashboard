import {useState} from "react";
import {BodyPartVisualization} from "./bodyPart/BodyPartVisualization";
import {General} from "./General";
// import {Cognitive} from "./cognitive/Cognitive";

export const bodyParts = ['general', 'shoulder', 'elbow'] as const // 'wrist', 'hand','cognitive' ] as const
export type BodyPart = typeof bodyParts[number]

export const Data = () => {
    const [selectedBodyPart, setSelectedBodyPart] =
        useState<BodyPart>('general')


    const getDetail = () => {
        switch (selectedBodyPart) {
            // case 'cognitive':
            //     return <Cognitive selectedBodyPart={selectedBodyPart} setSelectedBodyPart={setSelectedBodyPart}/>
            case 'general':
                return <General selectedBodyPart={selectedBodyPart} setSelectedBodyPart={setSelectedBodyPart}/>
            default:
                return <BodyPartVisualization
                    selectedBodyPart={selectedBodyPart}
                    setSelectedBodyPart={setSelectedBodyPart}/>
        }
    }
    //根据返回的selectedBodyPart来决定显示哪个组件

    return <div className={`bg-tertiary p-4 w-full shadow-inner @container`}>
        {getDetail()}
    </div>
}