import './CircularProgress.css'
import {FC, ReactNode} from 'react'

export const CircularProgress: FC<{ progress: number, children: ReactNode }> = ({progress, children}) => {
    return <div className="circle bg-primary h-28 w-28" style={{
        backgroundImage: `conic-gradient(#435fe1 ${progress}%, #BDC7F3 0)`
    }}>
        <div className="inner p-3 bg-white">
            <div className='flex bg-primary text-white rounded-full aspect-square w-full h-full items-center justify-center text-base'>
                {children}
            </div>
        </div>
    </div>

}