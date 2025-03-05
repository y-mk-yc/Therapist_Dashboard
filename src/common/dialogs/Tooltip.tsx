import { AiOutlineInfoCircle } from "react-icons/ai";

export const ReHybTooltip = (props: {
    tip: string
    className?: string
}) =>
{
    return <div className={'relative w-full'}>
        <AiOutlineInfoCircle className={'fill-primary cursor-help peer'} />
        <div className={`absolute bg-tertiary py-1 -translate-x-1/2 whitespace-normal hidden ` +
            'p-4 text-text-dark rounded bottom-5 shadow-lg max-w-lg peer-hover:flex ' +
            `transition-all w-full border border-secondary2 ${props.className}`} >
            {props.tip}
        </div>
    </div>
}