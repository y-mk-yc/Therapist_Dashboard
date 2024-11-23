import {useNavigate} from 'react-router-dom'
import {AiOutlineLeft} from 'react-icons/ai'
import {CSSProperties} from 'react'

export const BackButton = (props: {backPath: string, label: string, style?: CSSProperties}) => { //返回按钮
    const navigate = useNavigate()

    return <button className='flex font-bold text-text-dark text-lg px-4 items-center gap-2 stroke-2
        whitespace-nowrap cursor-pointer hover:brightness-125 select-none h-3 self-center justify-start'
                   style={props.style}
                   onClick={() => {
                       navigate(props.backPath)
                   }}
    >
        <AiOutlineLeft className='w-10 aspect-square stroke-[50] fill-primary stroke-primary'/>
        {props.label}
    </button>
}