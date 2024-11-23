import dayjs from "dayjs";

export const parseDateOrToday = (str: string | undefined) => {
    if (str) {
        return new Date(str)
    }
    return new Date()
}

export const isDateToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}


export const shortTimeStr = (dateStr: string | undefined): string => {
    if (dateStr) return shortTime(new Date(dateStr))
    return '?'
}

export const shortTime = (date: Date | undefined): string => {
    if (!date) return ''
    // I would expect locales undefined to take the system one, but apparently not????
    // So I set GB to switch to 24h superior format.
    return date.toLocaleTimeString('en-GB', {timeStyle: 'short'});
}



//获得Date的是星期几的函数
export const getWeekDayName = (day: Date) => {
    return day.toLocaleDateString('en-GB', {weekday: 'short'})
}
// console.log(getWeekDayName(new Date())); //比如今天是星期五，返回Fri

export const getWeekDays = (dayInWeek: Date): Date[] => {
    const week = [];
    // Make copy to not mutate
    const current = new Date(dayInWeek);
    // getDay() 函数返回的是星期几，星期日是 0，星期一是 1，星期二是 2，星期三是 3，星期四是 4，星期五是 5，星期六是 6
    // getDate() 函数返回的是一个月的第几天
    // 将 current 的时间设置为当前日期所在的星期的第一天，这里将星期一作为一周的第一天
    // 使用 % 运算符来计算偏移量
    const day = current.getDay();
    const dayOffset = (day + 6) % 7; // 当 day 为 0 (星期日) 时，(0 + 6) % 7 = 6，即星期日到星期一的偏移量是 -6 天
    current.setDate(current.getDate() - dayOffset);
    for (let i = 0; i < 7; i++) {
        week.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    return week;
}
// console.log(getWeekDays(new Date())); //返回的是一个数组，数组中的元素是当前日期所在的星期的所有日期，从星期一开始，到星期日结束，
// 比如今天是2024-3-20，返回的是[Date: "2024-03-18T09:14:51.509Z", Date: "2024-03-19T09:14:51.509Z", Date: "2024-03-20T09:14:51.509Z", Date: "2024-03-21T09:14:51.509Z", Date: "2024-03-22T09:14:51.509Z", Date: "2024-03-23T09:14:51.509Z", Date: "2024-03-24T09:14:51.509Z"]

export const getWeekDayNames = (): string[] => {
    return getWeekDays(new Date()).map(getWeekDayName)
}
// console.log(getWeekDayNames());
// 返回的是一个数组，数组中的元素是当前日期所在的星期的所有星期名，从星期一开始，到星期日结束，比如今天是2024-3-20，返回的是["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
// 实际情况永远是["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
export const getDateString = (day: Date) => {
    return day.toLocaleDateString('en-GB', {day: 'numeric', month: 'numeric', year: 'numeric'})
}

export const getDifferenceInMinutes = (from: Date, to: Date): number => {
    return dayjs(to).diff(from, 'm')
}

export const getMonthYearString = (day: Date) => {
    return day.toLocaleDateString('en-GB', {month: 'short', year: '2-digit'})
}


export const areDatesSame = (d1: Date, d2: Date) => {
    return d1.getFullYear() == d2.getFullYear() &&
        d1.getMonth() == d2.getMonth() &&
        d1.getDate() == d2.getDate()
}

export const getAgeInYears = (birthday: Date) => {
    // ~~ is faster Math.floor
    // 31557600000 is 24 * 3600 * 365.25 * 1000
    // The age is off by 10-20 hours https://stackoverflow.com/a/15555947/1739173
    return ~~((Date.now() - birthday.getTime()) / (31557600000));
}

export const getTimeAsDayPercentage = (datetime: Date) => {
    const SECONDS_IN_DAY = 24 * 60 * 60 //24小时*60分钟*60秒
    const seconds = datetime.getHours() * 60 * 60 + datetime.getMinutes() * 60 + datetime.getSeconds() //将datetime的时间转换成从0点开始的秒数
    return (seconds / SECONDS_IN_DAY) * 100 //返回datetime时间占一天的百分比，例如：如果时间是12:00，返回的是50
}

export const getDurationAsDayPercentage = (start: Date, end: Date) => {
    const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000 //24小时*60分钟*60秒*1000毫秒
    const diff_in_millis = end.getTime() - start.getTime() //计算开始时间和结束时间的时间差
    return (diff_in_millis / MILLISECONDS_IN_DAY) * 100 //返回时间差占一天的百分比,例如：如果时间差是12小时，返回的是50
}




export const getMonthDays = (dayInMonth: Date): Date[] => {
    const monthDays = [];
    const date = new Date(dayInMonth.getFullYear(), dayInMonth.getMonth(), 1);
    while (date.getMonth() === dayInMonth.getMonth()) {
        monthDays.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return monthDays;
}


//将2024-03-08 变成Date形式的函数
export const parseYYYYMMDD = (dateString: string, delimiter: string = '-'): Date => {
    const parts = dateString.split(delimiter).map(stringNumber => +stringNumber)
    return new Date(parts[0], parts[1] - 1, parts[2])
}

// export const parseDDMMYYYY = (dateString: string, delimiter: string = '-'): Date => {
//     //31-12-2024转换成Date对象；或者31/12/2024搭配第二个参数“/”转换成Date对象
//     const parts = dateString.split(delimiter).map(stringNumber => +stringNumber)
//     return new Date(parts[2], parts[1], parts[0])
// }


//将Date对象转换成本地时间2024-03-08的形式
export const formatDate = (date:Date) => {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return year + "-" + month + "-" + day;
}



