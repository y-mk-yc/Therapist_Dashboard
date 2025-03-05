import { ReactNode } from 'react'

export const divWrapper = (baseStyle: string) =>
{
    return (props: { children: ReactNode, className?: string }) =>
    {
        return <div className={`${baseStyle} ${props.className}`}>
            {props.children}
        </div>
    }
}
