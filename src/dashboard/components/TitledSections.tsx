import React, {ReactNode} from "react";

export const TitledSection = (props: { title: string, children: ReactNode, className?: string  }) => {
    return <div className={`flex flex-col gap-3 mb-4 ${props.className}`}>
        <h3 className='font-bold'>{props.title}</h3>
        {props.children}
    </div>
}