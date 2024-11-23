import harold from './old-guy.png'

export const defaultOrImgSrc = (url: string | undefined): string => {
    if (!url || url?.length == 0) {
        return harold
    }

    return url
}


export const getLatestObject = (data: any[]) => {
    if (data.length === 0 || !data[0].hasOwnProperty('Date')) {
        return null;
    }
    return data.reduce((latest, current) =>
        new Date(current.Date) > new Date(latest.Date) ? current : latest
    );
}