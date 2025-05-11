export const betweenDates = (dateToCheck: Date, start: number, end: number) => {
  const today = new Date();

  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - start);
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() - end);

  return dateToCheck <= startDate && dateToCheck >= endDate;
};
