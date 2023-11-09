export const getCurrDateIsrael = () => {
    const here = new Date();
    const invDate = new Date(here.toLocaleString('en-US', { timeZone: 'Israel' }));
    const diff = here.getTime() - invDate.getTime();
    return new Date(here.getTime() - diff);
};

export const isYesterday = (date: string, today: string) => { // gets date in format d/m/yyyy
    let dateArr = date.split("/");
    let todayArr = today.split("/");

    const year = 0;
    const month = 1;
    const day = 2;

    if (dateArr[year] === todayArr[year] &&
        dateArr[month] === todayArr[month] &&
        Number(dateArr[day]) == Number(todayArr[day]) - 1)
        return true;

    return false;
}