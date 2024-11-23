import {areDatesSame, getMonthDays, getMonthYearString, getWeekDayNames} from "../../common/dateUtils";
import * as R from 'rambda'
import {useEffect, useState} from "react";
import {AiOutlineLeft, AiOutlineRight} from "react-icons/ai";

export const BoxedSchedule = (props: { onDateSelected: (newDate: Date) => void }) => {
    return <div className={'flex flex-col items-center gap-2 bg-tertiary p-6 rounded-xl'}>
        <h2>Schedule</h2>
        <Schedule onDateSelected={props.onDateSelected}/>
    </div>
}

export const Schedule = (props: { onDateSelected: (newDate: Date) => void }) => {
    const weekDayNames = getWeekDayNames() //["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const today = new Date() //本地时间，按2024-03-20T09:53:26.541Z格式返回

    const [selectedDate, setSelectedDate] = useState(today)
    const [monthDay, setMonthDay] = useState(today)

    useEffect(() => {
        props.onDateSelected(selectedDate)
    }, [selectedDate])  //当selectedDate改变时，调用props.onDateSelected(selectedDate)

    const monthDays = getMonthDays(monthDay)
    const offset = (monthDays[0].getDay() + 6) % 7 //用来计算月初是星期几的，比如2024-3-1是星期五，那么offset=4
    const placeholders: string[] = new Array(offset).fill("");

    const moveMonth = (forward: boolean) => {
        const monthDayCopy = new Date(monthDay)
        const newDate = new Date(monthDayCopy.setMonth(monthDayCopy.getMonth() + (forward ? 1 : -1)));
        setMonthDay(newDate)
    } //forward为true时，monthDay的月份加1，为false时，monthDay的月份减1

    return <>
        <div className={'flex items-center justify-center'}>
            <button
                className={'btn-icon hover:bg-secondary py-1'}
                onClick={() => moveMonth(false)}><AiOutlineLeft/>
            </button>
            <span className={'flex-grow text-center min-w-[40px]'}>{getMonthYearString(monthDay)}</span>
            <button
                className={'btn-icon hover:bg-secondary py-1'}
                onClick={() => moveMonth(true)}><AiOutlineRight/>
            </button>
        </div>
        <div className={'grid grid-cols-[repeat(7,1fr)] gap-2 w-full items-center justify-center justify-items-center'}>
            {...weekDayNames.map(name => <span
                className={'text-secondary2 text-center text-sm font-bold mb-2'}>{name}</span>)}
            {offset > 0 && placeholders.map((value, index) =>
                <div key={index} className={`col-span-1 bg-white`}>{value}</div>)}
            {...monthDays.map(day => {
                    let style = 'text-text-dark'
                    if (day.getTime() < today.getTime()) {
                        style = 'text-text-light'
                    }

                    if (areDatesSame(day, selectedDate)) {
                        style += ' bg-primary text-white'
                    }

                    return <button
                        key={day.getDate()}
                        onClick={() => {
                            setSelectedDate(day)
                        }}
                        className={`flex flex-col rounded-full 
                        hover:bg-primary hover:text-white items-center aspect-square justify-center m-0 w-10 ${style}`}>
                        {day.getDate()}
                    </button>

                }
            )}
        </div>
    </>
}