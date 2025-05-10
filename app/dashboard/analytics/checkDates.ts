export const checkDates = (dateToCheck: Date, daysAgo: number) => {
  //this function checks if the date is within the last x days
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - daysAgo);

  return (
    pastDate.getDate() === dateToCheck.getDate() &&
    pastDate.getMonth() === dateToCheck.getMonth() &&
    pastDate.getFullYear() === dateToCheck.getFullYear()
  );
};
