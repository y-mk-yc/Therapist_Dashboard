import { RangeData } from "../common/graphs/rangeGraph/RangeGraph";

export const generateDateNoData = (period: 'Week' | 'Month' | 'AllTime') =>
{
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateNoData = Array.from({ length: 7 }, (_, i) =>
    {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        return date.toISOString();
    }).reverse();

    if (period === 'Month')
    {
        dateNoData[0] = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29).toISOString();
        dateNoData[3] = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15).toISOString();
        dateNoData[6] = today.toISOString();
    } else if (period === 'AllTime')
    {
        dateNoData[0] = new Date(2020, 0, 1).toISOString();
    }
    return dateNoData;
};
