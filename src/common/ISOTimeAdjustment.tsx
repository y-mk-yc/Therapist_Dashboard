export function setLocalNoonToISOString(date: Date)
{
    // Create a new Date object from the input
    const localDate = new Date(date);

    // Set the time to 12:00 PM (noon) in local time
    localDate.setHours(12, 0, 0, 0); // Set time to 12:00:00

    // Get the local timezone offset in minutes (Denmark's offset: UTC+1 or UTC+2)
    const localTimezoneOffset = localDate.getTimezoneOffset();

    // Helper function to format the timezone offset in the correct ISO string format
    function getTimeZoneOffsetString(offset: any)
    {
        const sign = offset > 0 ? '-' : '+';
        const hours = Math.abs(offset) / 60;
        const minutes = Math.abs(offset) % 60;
        return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    // Convert back to ISO string and adjust the timezone
    const fixedIsoString = localDate.toISOString().replace('T00:00:00.000Z', `T12:00:00.000${getTimeZoneOffsetString(localTimezoneOffset)}`);

    return fixedIsoString;  // Returns the adjusted ISO string
}


