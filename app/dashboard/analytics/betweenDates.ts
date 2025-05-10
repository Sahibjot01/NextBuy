export const betweenDates = (dateToCheck: Date, start: number, end: number) => {
  const today = new Date();

  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - start);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() - end);
  endDate.setHours(0, 0, 0, 0);

  return dateToCheck <= startDate && dateToCheck >= endDate;
};
