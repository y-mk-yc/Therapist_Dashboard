import {IconInCircle} from './IconInCircle'
import {AiFillLike, AiFillDislike} from 'react-icons/ai'
import {CSSProperties, FC} from 'react'
import {Exercise} from '../store/rehybApi'
import {GiBiceps} from "react-icons/gi";

export const ExerciseCard: FC<{
    style?: CSSProperties, exercise: Exercise
}> = ({style, exercise}) => {
    const therapyFocus = Object.entries(exercise.TherapyFocus)
        .filter(([_, value]) => value)
        .map(([key, _]) => key);

    const interestTags = Object.entries(exercise.InterestTags)
        .filter(([_, value]) => value)
        .map(([key, _]) => key);

    const likeRateColor = exercise.LikeRate !== undefined ?
        (exercise.LikeRate > 0 ? 'positive' : (exercise.LikeRate === 0 ? 'middle' : 'negative')) : '';

    return <div className='card flex items-center gap-6 min-w-min cursor-grab relative' style={style}>
        <div className='flex flex-col gap-3 flex-2 flex-wrap min-w-[200px]'>
            <div className='flex items-center gap-2'>
                <IconInCircle icon={<GiBiceps/>} size={6}/>
                <h3>{exercise.ProtocolName ?? ''}</h3>
            </div>
            <span>
                <b>Description:</b> {exercise.ProtocolDescription}
            </span>
            <div className={`flex gap-2 justify-between`}>
                <div className={`flex-col flex`}>
                    <span className={`font-semibold`}>Focus:</span>
                    {therapyFocus.map((focus) => <span key={focus}>- {focus}</span>)}
                </div>
                <div className={`flex-col flex`}>
                    <span className={`font-semibold`}>Interests:</span>
                    {interestTags.map((interest) => <span key={interest}>- {interest}</span>)}
                </div>

            </div>
        </div>
        <img className={'rounded w-32'} src={exercise.Thumbnail} alt={`Protocol Thumbnail`}/>
        {exercise.LikeRate !== undefined &&
            <div className={`absolute bottom-2 right-2 `}>
                <div className={`text-${likeRateColor} flex relative`}>
                    {Math.round(exercise.LikeRate * 100)}%
                    {exercise.LikeRate >= 0 ?
                        <AiFillLike className={`w-6 h-6  fill-${likeRateColor} absolute -left-6 -top-[2px]`}/> :
                        <AiFillDislike className={`w-6 h-6  fill-${likeRateColor} absolute -left-6 -top-[2px]`}/>}
                </div>
            </div>}

    </div>
}