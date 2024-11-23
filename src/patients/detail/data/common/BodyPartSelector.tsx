import {BigSelect} from "../../../../common/Inputs";
// import {Human} from "../Human";
import {BodyPart, bodyParts} from "../Data";
import React, {useEffect, useState} from 'react';

export const BodyPartSelector = (props: {
    setSelectedBodyPart: (part: BodyPart) => void,
    selectedBodyPart: BodyPart,
    className?: string
}) => {

    return <div className={`flex flex-col items-center gap-10 ${props.className} absolute left-[38%]`}>
        <BigSelect
            className={''}
            onValueSet={value => props.setSelectedBodyPart(value as BodyPart)}
            value={props.selectedBodyPart} values={bodyParts.map(part => ({value: part, text: part}))}/>
        {/*<Human active={props.selectedBodyPart}*/}
        {/*       className={'w-48 ml-14 hidden @6xl:block'}*/}
        {/*       onSelected={props.setSelectedBodyPart}/>*/}
    </div>
}