import {useEffect, useState} from 'react'
import ical, {CalendarComponent, FullCalendar} from 'ical'

// Fix for the ical library
type Attendee = {
    email: string
}
export type ICalEvent = CalendarComponent & {
    attendees: Attendee[]
}

export const isCalendar = (calendar: any): calendar is FullCalendar => {
    return !(typeof calendar === 'string')
}

export const useCalendar = (calendarUrl: string | undefined) => {
    const [calendar, setCalendar] = useState<FullCalendar | 'LOADING' | 'ERROR' | 'UNINITIALIZED'>('UNINITIALIZED')

    useEffect(() => {
            const downloadCalendar = async () => {
                try {
                    // Petr's proxy, should be replaced
                    const response = await fetch(`https://cors-proxy-whj3gjfpza-uc.a.run.app/${calendarUrl}`)
                    const rawCalendar = await response.text()
                    const parsedCalendar = ical.parseICS(rawCalendar)
                    setCalendar(parsedCalendar)
                } catch (e) {
                    console.error(e)
                    setCalendar('ERROR')
                }
            }

            if (calendarUrl && calendar == 'UNINITIALIZED') {
                setCalendar('LOADING')
                downloadCalendar()
            }
        }, [calendarUrl]
    )

    return calendar
}

export const eventsToArray = (calendar: FullCalendar) => {
    return Object.values(calendar).filter((event) => event.type == 'VEVENT').map(event => {
        let attendees: Attendee[] = []
        if (event.attendee) {
            if (Array.isArray(event.attendee)) {
                attendees = event.attendee.map(at => ({email: at.params.CN}))
            } else {
                // @ts-ignore
                attendees = [{email: event.attendee.params.CN}]
            }
        }

        return {...event, attendees}
    })
}


