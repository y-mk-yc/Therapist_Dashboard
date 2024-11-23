import {ReactNode} from 'react'


// I'm not sure if it's proper
// https://tailwindcss.com/docs/content-configuration#dynamic-class-names
const sizes: Record<number, string> = {
    '1': `[&>svg]:h-1 [&>svg]:w-1 p-1`,
    '2': `[&>svg]:h-2 [&>svg]:w-2 p-1`,
    '5': `[&>svg]:h-5 [&>svg]:w-5 p-2`,
    '6': `[&>svg]:h-6 [&>svg]:w-6 p-2`,
    '7': `[&>svg]:h-7 [&>svg]:w-7 p-3`,
    '10': `[&>svg]:h-10 [&>svg]:w-10 p-4`,
}

export const IconInCircle = (props: { icon: ReactNode, inverse?: boolean, size?: keyof typeof sizes}) => {
    const size = (props.size ?? 10)
    //size的值只能是sizes的key，即1,2,5,6,7,10

    const baseStyle = `flex items-center rounded-full h-fit aspect-square justify-center w-fit`
    const bg = props.inverse ? 'bg-secondary' : 'bg-primary'
    const fg = props.inverse ? '[&>svg]:fill-primary' : '[&>svg]:fill-white'

    const final = `${baseStyle} ${bg} ${fg} ${sizes[size]}`

    return <div className={final} style={{}}>
        {props.icon}
    </div>
}
