import { areDatesSame, getMonthDays, getMonthYearString, getWeekDayNames } from "../../common/dateUtils";
// import * as R from 'rambda'
import { useEffect, useRef, useState } from "react";
import { AiOutlineLeft, AiOutlinePlus, AiOutlineRight } from "react-icons/ai";
import { SideDialog } from "../../common/dialogs/SideDialog";
import { Loader } from "../../common/Loader";

import { AppInfo, GetPatientsApiArg, useGetActivePatientsQuery, usePostAppointmentsByTherapistIdAndDateMutation } from "../../store/rehybApi";
import CustomDropdown from "../../common/CustomDropdown ";
import { Bounce, toast } from "react-toastify";
import { setLocalNoonToISOString } from "../../common/ISOTimeAdjustment";
export const BoxedSchedule = (props: { onDateSelected: (newDate: Date) => void }) =>
{
    return <div className={'flex flex-col items-center gap-2 bg-tertiary p-6 rounded-xl'}>
        <h2>Schedule</h2>
        <Schedule onDateSelected={props.onDateSelected} showAddPointment={true} />
    </div>
}

const TimePicker = (props: { setSelectedHour: (value: number) => void, setSelectedMinute: (value: number) => void }) =>
{
    // Local state for selected hour and minute
    const [selectedMinute, setSelectedMinute] = useState<number>(0); // Default to 0
    const [selectedHour, setSelectedHour] = useState<number>(12); // Default to 12

    // Generate data for hours and minutes
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

    const hourRef = useRef<HTMLDivElement>(null);
    const minuteRef = useRef<HTMLDivElement>(null);

    // Function to center a clicked value
    const scrollToCenter = (containerRef: React.RefObject<HTMLDivElement>, index: number) =>
    {
        const container = containerRef.current;
        if (container)
        {
            // Use firstElementChild for more specific typing
            const firstChild = container.firstElementChild as HTMLElement | null;
            if (firstChild)
            {
                const itemHeight = firstChild.getBoundingClientRect().height;
                container.scrollTo({
                    top: index * itemHeight - container.offsetHeight / 2 + itemHeight / 2,
                    behavior: "smooth",
                });
            }
        }
    };


    return (
        <div className="flex justify-center items-center gap-6 py-6">
            {/* Hours */}
            <div
                ref={hourRef}
                className="overflow-y-scroll w-16 flex flex-col items-center"
                //  onScroll={(e) => handleScroll(e, setSelectedHour)}
                style={{
                    scrollbarWidth: "none",
                    height: 200
                }}
            >
                {hours.map((hour, index) => (
                    <div
                        key={index}
                        className={`text-center text-lg py-2 transition-transform ${selectedHour === index ? "scale-125 text-black" : "scale-100 text-gray-400"}`}
                        onClick={() =>
                        {

                            setSelectedHour(hour);
                            scrollToCenter(hourRef, index); // Center clicked hour
                            props.setSelectedHour(hour)
                        }}
                    >
                        {hour.toString().padStart(2, "0")}
                    </div>
                ))}
            </div>

            {/* Separator */}
            <span className="text-xl font-bold">:</span>

            {/* Minutes */}
            <div
                ref={minuteRef}
                className="overflow-y-scroll w-16 flex flex-col items-center"
                // onScroll={(e) => handleScroll(e, setSelectedMinute)}
                style={{
                    scrollbarWidth: "none",
                    height: 200
                }}
            >
                {minutes.map((minute, index) => (
                    <div
                        key={index}
                        className={`text-center text-lg py-2 transition-transform ${selectedMinute === minute ? "scale-125 text-black" : "scale-100 text-gray-400"}`}
                        onClick={() =>
                        {
                            setSelectedMinute(minute);
                            scrollToCenter(minuteRef, index); // Center clicked minute
                            props.setSelectedMinute(minute)
                        }} // Call handleMinuteClick on click
                    >
                        {minute.toString().padStart(2, "0")}
                    </div>
                ))}
            </div>
        </div>
    );
};

const AddNewAppointement = (props: { onDone: (value: boolean) => void, date: Date, onClose: (value: boolean) => void }) =>
{
    console.log("setLocalNoonToISOString(props.date).split('T')[0]=", setLocalNoonToISOString(props.date))
    const [pickDate, setPickDate] = useState(setLocalNoonToISOString(props.date).split('T')[0])
    const [pickTime, setPickTime] = useState(props.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    // console.log(pickTime)//13:25
    const [showCalendar, setShowCalendar] = useState<boolean>(false)
    const [showTime, setShowTime] = useState<boolean>(false)
    const [selectedDate, setSelectedDate] = useState(new Date(setLocalNoonToISOString(props.date).split('T')[0]))
    //Displayed on the
    const [selectedHour, setSelectedHour] = useState(12);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const [pickEndsDate, setPicEndskDate] = useState(setLocalNoonToISOString(props.date).split('T')[0])
    const [pickEndsTime, setPickEndsTime] = useState(props.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    const [showEndsCalendar, setShowEndsCalendar] = useState<boolean>(false)
    const [showEndsTime, setShowEndsTime] = useState<boolean>(false)
    const [selectedEndsDate, setSelectedEndsDate] = useState(new Date(setLocalNoonToISOString(props.date).split('T')[0]))
    const [selectedEndsHour, setSelectedEndsHour] = useState(12);
    const [selectedEndsMinute, setSelectedEndsMinute] = useState(0);
    const [patientID, setPatientID] = useState<string>()
    const [location, setLocation] = useState<string>()
    const [code, setCode] = useState<string | null>(null)
    //const [name, setName] = useState<string>("")

    const [sorting, setSorting] = useState<GetPatientsApiArg>({ sortBy: 'Name', asc: true, assigned: true })
    const { data, error, isFetching } = useGetActivePatientsQuery(sorting)
    const [createNewAppointment, { isLoading }] = usePostAppointmentsByTherapistIdAndDateMutation()
    const [appInfor, setAppInfor] = useState<AppInfo>({
        Starts: new Date(setLocalNoonToISOString(props.date)),
        Ends: new Date(setLocalNoonToISOString(props.date)),
        PatientID: "",
        Name: "",
        Note: null,
        Title: null,
        Location: null,
        Address: null,
        Code: null
    })
    const options = data
        ? data.map((patient) => ({
            value: patient.PatientID,
            label: patient.Name,
            email: patient.Email
        }))
        : [];
    const locationOptions = [{
        value: 'offline',
        label: 'offline',
    },
    {
        value: 'online',
        label: 'online',
    }]
    const combineDateTime = (date: Date, hour: number, minute: number): Date =>
    {
        const newDate = new Date(date);
        newDate.setHours(hour, minute, 0, 0); // Set hours, minutes, seconds, and milliseconds
        return newDate;
    };
    const showCalendarAndTime = (props: {
        showCalendar?: boolean,
        showTime?: boolean,
        showEndsCalendar?: boolean,
        showEndsTime?: boolean
    }) =>
    {
        const {
            showCalendar = false,
            showTime = false,
            showEndsCalendar = false,
            showEndsTime = false
        } = props;

        setShowCalendar(showCalendar);
        setShowTime(showTime);
        setShowEndsCalendar(showEndsCalendar);
        setShowEndsTime(showEndsTime);
    };
    const formatTime = (hour: number, minute: number) =>
        `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

    useEffect(() =>
    {
        console.log(selectedDate, selectedHour, selectedMinute)
        const newStartDate = combineDateTime(selectedDate, selectedHour, selectedMinute);
        const newEndsDate = combineDateTime(selectedEndsDate, selectedEndsHour, selectedEndsMinute);

        // If the start is later than the end, update the end to match the start
        if (newStartDate > newEndsDate)
        {
            setSelectedEndsDate(selectedDate);
            setSelectedEndsHour(selectedHour);
            setSelectedEndsMinute(selectedMinute);

            setPickEndsTime(formatTime(selectedHour, selectedMinute));
            setPicEndskDate(setLocalNoonToISOString(newStartDate).split('T')[0]);
            setAppInfor({
                ...appInfor,
                Starts: newStartDate,
                Ends: newStartDate,
            });
        } else
        {
            setAppInfor({
                ...appInfor,
                Starts: newStartDate,
            });
        }

        // Update displayed values for start time
        setPickDate(setLocalNoonToISOString(newStartDate).split('T')[0]);
        setPickTime(formatTime(selectedHour, selectedMinute));
    }, [selectedDate, selectedHour, selectedMinute]);

    // useEffect for End Time
    useEffect(() =>
    {
        const newEndsDate = combineDateTime(selectedEndsDate, selectedEndsHour, selectedEndsMinute);
        const newStartDate = combineDateTime(selectedDate, selectedHour, selectedMinute);

        // If the end is earlier than the start, update the start to match the end
        if (newEndsDate < newStartDate)
        {
            setSelectedDate(selectedEndsDate);
            setSelectedHour(selectedEndsHour);
            setSelectedMinute(selectedEndsMinute);

            setPickTime(formatTime(selectedEndsHour, selectedEndsMinute));
            setPickDate(setLocalNoonToISOString(newEndsDate).split('T')[0]);
            setAppInfor({
                ...appInfor,
                Starts: newEndsDate,
                Ends: newEndsDate,
            });
        } else
        {
            setAppInfor({
                ...appInfor,
                Ends: newEndsDate,
            });
        }

        // Update displayed values for end time
        setPicEndskDate(setLocalNoonToISOString(newEndsDate).split('T')[0]);
        setPickEndsTime(formatTime(selectedEndsHour, selectedEndsMinute));
    }, [selectedEndsDate, selectedEndsHour, selectedEndsMinute]);
    async function handleSaveAppointment(): Promise<void>
    {
        try
        {
            const result = await createNewAppointment({
                Appointment: appInfor
            }).unwrap();
            console.log("Appointment created:", result)
            toast.success('Appointment created', {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });

            props.onClose(false)
        } catch (e)
        {
            console.log("Failed to create new appointment:", e)
        }
    }
    function generateRandomCode()
    {
        var code = Math.floor(100000 + Math.random() * 900000).toString();

        return code;
    }
    return (
        <SideDialog title={"Add Appointment"} onClose={() => props.onDone(false)} showCancelButton={false} >

            {/* Edit appointment time */}
            <table className="self-center w-full">
                <tbody >
                    <tr>
                        <td colSpan={4} className="p-0">
                            <div className="card rounded-lg  bg-gray-100 my-5">
                                {/* Title Row */}
                                <table className="w-full">
                                    <tbody>
                                        <tr className="mb-5">
                                            <td className="py-4 w-1/4">Title</td>
                                            <td colSpan={3} className="px-5">
                                                <input
                                                    placeholder="Title"
                                                    onChange={(e) => setAppInfor({ ...appInfor, Title: e.target.value })}
                                                    className=" max-w-full w-full px-4 py-2 border border-slate-300 rounded-md"
                                                />
                                            </td>
                                        </tr>

                                        {/* Location Row */}
                                        <tr className="mb-5 border-slate-300">
                                            <td className="py-4 w-1/4">Location</td>
                                            <td colSpan={3} className="px-5">
                                                <CustomDropdown
                                                    options={locationOptions}
                                                    onChange={(option) =>
                                                    {
                                                        setLocation(option.value)
                                                        // setName(option.label)
                                                        // setAppInfor({ ...appInfor, })
                                                        if (option.value === 'online')
                                                        {
                                                            const code = generateRandomCode()
                                                            setCode(code)
                                                            setAppInfor({ ...appInfor, Code: code, Location: option.value })
                                                        } else
                                                        {
                                                            setAppInfor({ ...appInfor, Location: option.value })
                                                        }
                                                    }}
                                                    placeholder="Select a location"
                                                />
                                            </td>
                                        </tr>
                                        {appInfor.Location === 'offline' && (
                                            <tr className="mb-5 border-slate-300">
                                                <td className="py-4 w-1/4">Offline Location</td>
                                                <td colSpan={3} className="px-5">
                                                    <input
                                                        placeholder="Location or Video Call"
                                                        onChange={(e) => setAppInfor({ ...appInfor, Address: e.target.value })}
                                                        className=" max-w-full w-full px-4 py-2 border border-slate-300 rounded-md"
                                                    />
                                                </td>
                                            </tr>
                                        )}
                                        {appInfor.Location === 'online' && (
                                            <tr className="mb-5 border-slate-300">
                                                <td className="py-4 w-1/4">Meeting code</td>
                                                <td colSpan={3} className="px-5">
                                                    <input disabled={true}
                                                        placeholder="Location or Video Call"
                                                        value={code!}
                                                        onChange={(e) => setAppInfor({ ...appInfor, Address: 'online', Code: code })}
                                                        className=" max-w-full w-full px-4 py-2  "
                                                    />
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td colSpan={4} className="p-0">
                            <div className="card rounded-lg overflow-hidden bg-gray-100">
                                {/* Start and End Dates Row */}
                                <table className="w-full">
                                    <tbody>
                                        <tr className="">
                                            {/* Start Date */}
                                            <td className="">Starts</td>
                                            <td className="flex space-x-2 justify-end pr-2 py-4 pb-4">
                                                <span
                                                    onClick={() => showCalendarAndTime({ showCalendar: !showCalendar })}
                                                    className={`${!showCalendar ? 'bg-slate-200' : 'bg-slate-300'} rounded-lg p-1 px-5`}
                                                >
                                                    {pickDate}
                                                </span>
                                                <span
                                                    onClick={() => showCalendarAndTime({ showTime: !showTime })}
                                                    className={`${!showTime ? 'bg-slate-200' : 'bg-slate-300'} rounded-lg p-1 px-5`}
                                                >
                                                    {pickTime}
                                                </span>
                                            </td>

                                            {/* End Date */}
                                            <td className="">Ends</td>
                                            <td className="flex space-x-2 justify-end pr-2 pb-4">
                                                <span
                                                    onClick={() => showCalendarAndTime({ showEndsCalendar: !showEndsCalendar })}
                                                    className={`${!showEndsCalendar ? 'bg-slate-200' : 'bg-slate-300'} rounded-lg p-1 px-5`}
                                                >
                                                    {pickEndsDate}
                                                </span>
                                                <span
                                                    onClick={() => showCalendarAndTime({ showEndsTime: !showEndsTime })}
                                                    className={`${!showEndsTime ? 'bg-slate-200' : 'bg-slate-300'} rounded-lg p-1 px-5`}
                                                >
                                                    {pickEndsTime}
                                                </span>
                                            </td>
                                        </tr>

                                        {/* Conditional Render: Show Calendar */}
                                        {showCalendar && (
                                            <tr className="border-t border-slate-300 pb-10">
                                                <td className="pb-4" colSpan={4}>
                                                    <Schedule onDateSelected={setSelectedDate} showAddPointment={false} date={selectedDate} />
                                                </td>
                                            </tr>
                                        )}

                                        {/* Conditional Render: Show Time Picker */}
                                        {showTime && (
                                            <tr className="border-t border-slate-300">
                                                <td className="pb-4" colSpan={4}>
                                                    <TimePicker setSelectedHour={setSelectedHour} setSelectedMinute={setSelectedMinute} />
                                                </td>
                                            </tr>
                                        )}

                                        {/* Conditional Render: Show End Calendar */}
                                        {showEndsCalendar && (
                                            <tr className="border-t border-slate-300 pb-10">
                                                <td className="pb-4" colSpan={4}>
                                                    <Schedule onDateSelected={setSelectedEndsDate} showAddPointment={false} date={selectedEndsDate} />
                                                </td>
                                            </tr>
                                        )}

                                        {/* Conditional Render: Show End Time Picker */}
                                        {showEndsTime && (
                                            <tr className="border-t border-slate-300">
                                                <td className="pb-4" colSpan={4}>
                                                    <TimePicker setSelectedHour={setSelectedEndsHour} setSelectedMinute={setSelectedEndsMinute} />
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody >
                    <tr>
                        <td colSpan={4} className="p-0">
                            <div className="card rounded-lg  bg-gray-100 my-5">
                                {/* Title Row */}
                                <table className="w-full">
                                    <tbody>
                                        <tr className="mb-5">
                                            <td className="py-4 w-1/4">Patient<span className="text-red-500">*</span></td>
                                            <td colSpan={3} className="px-5">
                                                {(isFetching) && <Loader style={{ marginTop: '2em' }} />}
                                                {!(isFetching) && data && <div >
                                                    <CustomDropdown
                                                        maxHeight={250}
                                                        options={options}
                                                        onChange={(option) =>
                                                        {
                                                            setPatientID(option.value)
                                                            // setName(option.label)
                                                            setAppInfor({ ...appInfor, PatientID: option.value, Name: option.label })
                                                        }}
                                                        placeholder="Select a patient"
                                                    />
                                                </div>}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                </tbody>

            </table>

            <div className="card rounded-lg  bg-gray-100 my-5" >
                <textarea
                    placeholder="note"
                    rows={5}
                    className="w-full box-border p-2 max-w-full"
                    onChange={(e) => setAppInfor({ ...appInfor, Note: e.target.value })}
                />
            </div>
            <div className={`justify-center align-middle flex `} >
                <button className="btn-primary" disabled={patientID === undefined || isLoading} onClick={handleSaveAppointment}>Save</button>
            </div>



        </SideDialog >
    )
}
export const Schedule = (props: { onDateSelected: (newDate: Date) => void, showAddPointment: boolean, date?: Date }) =>
{
    const weekDayNames = getWeekDayNames() //["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const today = new Date() //本地时间，按2024-03-20T09:53:26.541Z格式返回

    const [selectedDate, setSelectedDate] = useState(props.date ?? today)
    const [monthDay, setMonthDay] = useState(props.date ?? today)
    const [addNewAppointmentShow, setAddNewAppointmentShow] = useState<boolean>(false)
    useEffect(() =>
    {
        console.log({ selectedDate })
        props.onDateSelected(selectedDate)
    }, [selectedDate])  //当selectedDate改变时，调用props.onDateSelected(selectedDate)

    const monthDays = getMonthDays(monthDay)
    const offset = (monthDays[0].getDay() + 6) % 7 //用来计算月初是星期几的，比如2024-3-1是星期五，那么offset=4
    const placeholders: string[] = new Array(offset).fill("");

    const moveMonth = (forward: boolean) =>
    {
        const monthDayCopy = new Date(monthDay)
        const newDate = new Date(monthDayCopy.setMonth(monthDayCopy.getMonth() + (forward ? 1 : -1)));
        setMonthDay(newDate)
    } //forward为true时，monthDay的月份加1，为false时，monthDay的月份减1

    return <>
        <div className="flex items-center w-full justify-center  ">
            {/* Text and navigation controls */}
            <div className=" flex items-center ">
                <button
                    className="btn-icon hover:bg-secondary py-1"
                    onClick={() => moveMonth(false)}
                >
                    <AiOutlineLeft />
                </button>
                <span className="text-center min-w-[40px]">
                    {getMonthYearString(monthDay)}
                </span>
                <button
                    className="btn-icon hover:bg-secondary py-1"
                    onClick={() => moveMonth(true)}
                >
                    <AiOutlineRight />
                </button>
            </div>

            {/* New Appointment Button */}
            {props.showAddPointment && <button
                className="btn-primary flex items-center absolute right-12"
                onClick={() => setAddNewAppointmentShow(true)}
            >
                <AiOutlinePlus className="" />
                <span className="hidden xl:inline text-white ">Appointment</span>
            </button>}
        </div >
        {addNewAppointmentShow && (
            <AddNewAppointement onDone={() => setAddNewAppointmentShow(false)} date={selectedDate} onClose={setAddNewAppointmentShow} />
        )
        }

        <div className={'grid grid-cols-[repeat(7,1fr)] gap-2 w-full items-center justify-center justify-items-center'}>
            {...weekDayNames.map(name => <span
                className={'text-secondary2 text-center text-sm font-bold mb-2'}>{name}</span>)}
            {offset > 0 && placeholders.map((value, index) =>
                <div key={index} className={`col-span-1 bg-white`}>{value}</div>)}
            {...monthDays.map(day =>
            {
                let style = 'text-text-dark'
                if (day.getTime() < today.getTime())
                {
                    style = 'text-text-light'
                }

                if (areDatesSame(day, selectedDate))
                {
                    style += ' bg-primary text-white'
                }

                return <button
                    key={day.getDate()}
                    onClick={() =>
                    {
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