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

export const formatLastMessageTimestamp = (timestamp: string) => {
    const curr = getCurrDateIsrael();
    const currDate = curr.toLocaleDateString();
    const other = new Date(timestamp);
    const otherDate = other.toLocaleDateString();
    const otherTime = other.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

    if (otherDate === currDate) // if date is today
    {
      return otherTime;
    }
    else if (isYesterday(otherDate, currDate)) {
      return "אתמול";
    }
    else {
      return otherDate.replace("/", ".").replace("/", "."); // twice in orderto replace all
    }
  }
