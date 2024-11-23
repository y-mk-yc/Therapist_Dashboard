import {shortTime} from "../../common/dateUtils";
import {TitledSection} from "./TitledSections";
import React, {useState} from "react";
import {LabeledInput} from "../../common/Inputs";

export const Events = () => {
    // const eventsSetup = Math.random() > 0.5 && false
    const eventsSetup = false;


    return <TitledSection title={'Events'}>
        {eventsSetup && <EventsList/>}
        {!eventsSetup && <EventsSetup/>}
    </TitledSection>
}

const EventsSetup = () => {  //Dashboard上的Events组件，显示日历事件
    const [calendar, setCalendar] = useState('')

    return <div className={'card flex flex-col gap-2'}>
        <span>To view events from your calendar on the dashboard, you need to synchronize your calendar first.</span>
        <div className={'flex items-end gap-4'}>
            <LabeledInput label={'ICal url:'} placeholder={'https://...'} onValueSet={setCalendar} value={calendar}
                          expand={true}
            />
            <button className={'btn-primary'}>Synchronize</button>
        </div>

    </div>
}

const EventsList = () => {
    const events = [
        {
            start: new Date(),
            end: new Date(),
            summary: 'Appointment',
            attendees: [
                'Patient A',
                'Patient B',
            ],
        }
    ]

    return <div className='flex flex-col gap-3'>
        {events.map(event => {
                const dates = `${shortTime(event.start)} - ${shortTime(event.end)}`
                return <div className='card'>
                    <h5>{event.summary}</h5>
                    <span className='text-gray-500'>{dates}</span>
                    <div className='flex items-baseline gap-2'>
                        <h6 className='mt-1 text-gray-500'>Participants: </h6>
                        <span>{event.attendees.join(', ')}</span>
                    </div>
                    <span></span>
                </div>
            }
        )}
    </div>
}