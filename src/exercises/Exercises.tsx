import {ExerciseCard} from '../common/ExerciseCard'
import {SearchBox, searchPredicate} from '../common/SearchBox'
import {Loader} from '../common/Loader'
import {useGetAllExerciseProtocolsQuery} from "../store/rehybApi";
import {useState} from "react";

export const Exercises = () => {
    const {data, isLoading, isError} = useGetAllExerciseProtocolsQuery()
    const [search, setSearch] = useState('')


    if (isLoading)
        return <Loader/>

    if (isError)
        return <span>Something went wrong.</span>

    return <div className='flex flex-col p-4 gap-4 items-center'>
        <div className='flex w-1/2 min-w-fit'>
            <SearchBox searchValue={search} setSearchValue={setSearch}/>
        </div>
        <div className='flex flex-wrap gap-4 justify-center'>
            {/*判断search的值是否为空，如果为空则返回所有的数据，否则判断是否在exercise.ProtocolName和exercise.ProtocolDescription中存在search的值，如果存在则返回数据*/}
            {data!.filter(exercise => {
                const interestTags = Object.entries(exercise.InterestTags)
                    .filter(([_, value]) => value)
                    .map(([key, _]) => key);
                const therapyFocus = Object.entries(exercise.TherapyFocus)
                    .filter(([_, value]) => value)
                    .map(([key, _]) => key);
                //把搜索的值也应用在interestTags和therapyFocus上
                return searchPredicate(search, exercise.ProtocolName, exercise.ProtocolDescription, ...interestTags, ...therapyFocus);
            }).map((exercise) => {
                return <ExerciseCard key={exercise.ProtocolID} style={{width: '50%'}} exercise={exercise}/>
            })}
        </div>
    </div>
}