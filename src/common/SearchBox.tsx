import {AiOutlineSearch} from 'react-icons/ai'
import {FC} from "react";
import {includesIgnoreCapital} from "./textUtils";
import * as R from 'rambda'

export const SearchBox: FC<{ searchValue: string, setSearchValue: (value: string) => void }> = (
    {
        searchValue,
        setSearchValue
    }) => {
    //<AiOutlineSearch className='fill-white h-6 w-6'/> 这个是搜索框中的所有图标
    return <div className='relative bg-white rounded-lg shadow-md overflow-hidden w-full'>
        <input id="default-search"
               className="block w-full p-4 pl-16 text-sm text-text-dark rounded-lg max-w-full"
               placeholder="Search..."
               value={searchValue}
               onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className='absolute left-1 bottom-0 h-full flex p-2 aspect-square'>
            <button className="flex text-white bg-primary rounded-full h-full aspect-square justify-center items-center">
                <AiOutlineSearch className='fill-white h-6 w-6'/>
            </button>
        </div>
    </div>
}

export const searchPredicate = (search: string, ...values: string[]) => {   //这个函数用来检查search是否在values里面
    if (search == '') return true   //如果search是空的，就返回,表示不用过滤
    //R.any接受一个函数和一个数组作为参数，如果数组中至少有一个元素使得传入的函数includesIgnoreCapital返回true，则R.any返回true。
    return R.any<string>((value) => includesIgnoreCapital(search, value))(values)
}