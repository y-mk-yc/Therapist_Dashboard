import {FC} from "react";

export const CircleCutout: FC<{
    minAngle: number,
    maxAngle: number,
    offsetAngle: number,

    centerX: number
    centerY: number
    radius: number

    textQuadrant: 'TR' | 'TL' | 'BR' | 'BL' | 'TC'
}> = ({minAngle, maxAngle, offsetAngle, centerX, centerY, radius, textQuadrant}) => {

    let offsetAngleFixed = -90

    const minAngleX = Math.cos(degToRad(minAngle + offsetAngleFixed)) * radius + centerX
    const minAngleY = Math.sin(degToRad(minAngle + offsetAngleFixed)) * radius + centerY

    const maxAngleX = Math.cos(degToRad(maxAngle + offsetAngleFixed)) * radius + centerX
    const maxAngleY = Math.sin(degToRad(maxAngle + offsetAngleFixed)) * radius + centerY


    const fillerLocationX = 5000
    const fillerLocationY = 500

    let textX = centerX - 20
    if (!textQuadrant.endsWith('C')) {
        textX += ((textQuadrant.endsWith('R')) ? 30 : -50)
    }


    const textY = centerY + ((textQuadrant.startsWith('T')) ? -20 : -40)

    return <>

        <clipPath id={`${radius}-${centerX}-${centerY}-clip`}>
            <circle key={radius} cx={centerX} cy={centerY} r={radius} fill={'red'}/>
        </clipPath>

        <path
            id={'filler'}
            d={`M ${centerX} ${centerY} L ${minAngleX} ${minAngleY} L ${fillerLocationX} ${fillerLocationY} L ${maxAngleX} ${maxAngleY} Z`}
            fill={'rgba(154,209,99,0.56)'}
            stroke={'transparent'}
            clipPath={`url(#${radius}-${centerX}-${centerY}-clip)`}
            transform={`rotate(${offsetAngle} ${centerX} ${centerY})`}
        />

        <text x={textX} y={textY} fill={'#50555C'}
              style={{fontWeight: 'bold'}}>{parseFloat((maxAngle - minAngle).toFixed(1))}</text>
    </>
}

export const CircleCutoutElbow: FC<{
    minAngle: number,
    maxAngle: number,
    offsetAngle: number,

    centerX: number
    centerY: number
    radius: number

    textQuadrant: 'TR' | 'TL' | 'BR' | 'BL' | 'TC'
}> = ({minAngle, maxAngle,offsetAngle, centerX, centerY, radius, textQuadrant}) => {

    //这里直接画了扇形，不像上面一样是填充一个大面积然后截取扇形的部分，因此不需要clipPath

    const minAngleX = Math.cos(degToRad(minAngle)) * radius + centerX
    const minAngleY = -Math.sin(degToRad(minAngle)) * radius + centerY

    const maxAngleX = Math.cos(degToRad(maxAngle)) * radius + centerX
    const maxAngleY = -Math.sin(degToRad(maxAngle)) * radius + centerY

    const largeArcFlag = (maxAngle - minAngle) > 180 ? 1 : 0;


    let textX = centerX - 20
    if (!textQuadrant.endsWith('C')) {
        textX += ((textQuadrant.endsWith('R')) ? 30 : -50)
    }


    const textY = centerY + ((textQuadrant.startsWith('T')) ? -20 : -40)

    return <>

        {/*<clipPath id={`${radius}-${centerX}-${centerY}-clip`}> /!*id不影响图像本身，下面的key也不影响*!/*/}
        {/*    <circle key={radius} cx={centerX} cy={centerY} r={radius}/>*/}
        {/*</clipPath>*/}

        <path
            id={'filler'}
            d={`M ${centerX} ${centerY} L ${minAngleX} ${minAngleY} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${maxAngleX} ${maxAngleY} Z`}
            fill={'rgba(154,209,99,0.56)'}
            stroke={'transparent'}
            // stroke={'red'}
            // clipPath={`url(#${radius}-${centerX}-${centerY}-clip)`}
            transform={`rotate(${offsetAngle} ${centerX} ${centerY})`}
        />

        <text x={textX} y={textY} fill={'#50555C'}
              style={{fontWeight: 'bold'}}>{parseFloat((maxAngle - minAngle).toFixed(1))}</text>
    </>
}


export const CircleCutoutShoulderHFE: FC<{
    minAngle: number,
    maxAngle: number,
    offsetAngle: number,

    centerX: number
    centerY: number
    radius: number

    textQuadrant: 'TR' | 'TL' | 'BR' | 'BL' | 'TC'
}> = ({minAngle, maxAngle,offsetAngle, centerX, centerY, radius, textQuadrant}) => {

    //这里直接画了扇形，不像上面一样是填充一个大面积然后截取扇形的部分，因此不需要clipPath

    const minAngleX = -Math.cos(degToRad(minAngle-90)) * radius + centerX
    const minAngleY = Math.sin(degToRad(minAngle-90)) * radius + centerY

    const maxAngleX = -Math.cos(degToRad(maxAngle-90)) * radius + centerX
    const maxAngleY = Math.sin(degToRad(maxAngle-90)) * radius + centerY

    const largeArcFlag = (maxAngle - minAngle) > 180 ? 1 : 0;


    let textX = centerX - 20
    if (!textQuadrant.endsWith('C')) {
        textX += ((textQuadrant.endsWith('R')) ? 30 : -50)
    }


    const textY = centerY + ((textQuadrant.startsWith('T')) ? -20 : -40)

    return <>

        {/*<clipPath id={`${radius}-${centerX}-${centerY}-clip`}> /!*id不影响图像本身，下面的key也不影响*!/*/}
        {/*    <circle key={radius} cx={centerX} cy={centerY} r={radius}/>*/}
        {/*</clipPath>*/}

        <path
            id={'filler'}
            d={`M ${centerX} ${centerY} L ${minAngleX} ${minAngleY} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${maxAngleX} ${maxAngleY} Z`}
            fill={'rgba(154,209,99,0.56)'}
            stroke={'transparent'}
            // stroke={'red'}
            // clipPath={`url(#${radius}-${centerX}-${centerY}-clip)`}
            transform={`rotate(${offsetAngle} ${centerX} ${centerY})`}
        />

        <text x={textX} y={textY} fill={'#50555C'}
              style={{fontWeight: 'bold'}}>{parseFloat((maxAngle - minAngle).toFixed(1))}</text>
    </>
}


const degToRad = (deg: number): number => {
    return deg / 360 * 2 * Math.PI
}