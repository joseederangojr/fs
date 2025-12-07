export const hourToSeconds = (hour: number) => {
  return hour * 60 * 60;
};

export const dateToSeconds = (date: Date = new Date()) => {
  return Math.floor(date.getTime() / 1000);
};

export const addSecondsToDate = (seconds: number, date: Date = new Date()) => {
  const dateInMs = date.getTime() + seconds * 1000;
  return new Date(dateInMs);
};

export const addHoursToDate = (hour: number, date: Date = new Date()) => {
  return addSecondsToDate(hourToSeconds(hour), date);
};
